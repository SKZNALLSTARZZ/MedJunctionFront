import React from 'react';
import Layout from '../Layout';
import {
  BsArrowDownLeft,
  BsArrowDownRight,
  BsArrowUpRight,
  BsCheckCircleFill,
  BsClockFill,
  BsXCircleFill,
} from 'react-icons/bs';
import { DashboardBigChart, DashboardSmallChart } from '../components/Charts';
import {
  dashboardCards,
} from '../components/Datas';
import { Transactiontable } from '../components/Tables';
import { Link } from 'react-router-dom';
import Loader from '../components/Notifications/Loader';
import { fetchLastFivePayment, fetchDashboardDataCount, fecthLastFivePatient, fecthTodayAppointments } from '../services/authService';

function Dashboard() {
  const [payment, setPayment] = React.useState([]);
  const [patient, setPatient] = React.useState([]);
  const [appointment, setAppointment] = React.useState([]);
  const [paymentLoading, setPaymentLoading] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const [dashboardData, setDashboardData] = React.useState({
    patientsCount: [],
    appointmentsCount: [],
    prescriptionsCount: [],
    paymentsCount: [],
  });
  const [consultationLoading, setConsultationLoading] = React.useState(true);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = user.token;

  const fetchDataCount = async () => {
    try {
      const requests = await fetchDashboardDataCount(token);
      const responses = await Promise.all(requests);
      const data = responses.map(response => response.data);
      console.log(data);
      setDashboardData({
        patientsCount: data[0],
        appointmentsCount: data[1],
        prescriptionsCount: data[2],
        paymentsCount: data[3],
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err.message);
      
    } 
    finally {
      setLoading(false);
    }
  };

  const fetchPayment = async () => {
    try {
      const response = await fetchLastFivePayment(token);
      setPayment(response.data.data);
      setPaymentLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err.message);
    } finally {
      setPaymentLoading(false);
    }
  };

  const fetchPatient = async () => {
    try {
      const response = await fecthLastFivePatient(token);
      setPatient(response.data);
    } catch (err) {
      console.error('Error fetching data:', err.message);
    }
  };

  const fetchAppointement = async () => {
    try {
      const response = await fecthTodayAppointments(token);
      setAppointment(response.data);
    } catch (err) {
      console.error('Error fetching data:', err.message);
    }
  };

  console.log('testappoi=', appointment);

  React.useEffect(() => {
    fetchAppointement();
    fetchPatient();
    fetchPayment();
    fetchDataCount();
  }, []);

  const updateDashboardCards = () => {
    const keys = [
      { dataKey: 'patientsCount', valueKey: 'totalCount', percentKey: 'percentageChange' },
      { dataKey: 'appointmentsCount', valueKey: 'totalCount', percentKey: 'percentageChange' },
      { dataKey: 'prescriptionsCount', valueKey: 'totalCount', percentKey: 'percentageChange' },
      { dataKey: 'paymentsCount', valueKey: 'totalAmount', percentKey: 'percentageChange' }
    ];

    keys.forEach((key, index) => {
      dashboardCards[index].datas = dashboardData[key.dataKey].monthlyCounts || dashboardData[key.dataKey].monthlyAmounts;
      dashboardCards[index].value = dashboardData[key.dataKey][key.valueKey];
      dashboardCards[index].percent = dashboardData[key.dataKey][key.percentKey];
    });
  };

  updateDashboardCards();
  if (loading && paymentLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* boxes */}
      <div className="w-full grid xl:grid-cols-4 gap-6 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">
        {dashboardCards.map((card, index) => (
          <div
            key={card.id}
            className=" bg-white rounded-xl border-[1px] border-border p-5"
          >
            <div className="flex gap-4 items-center">
              <div
                className={`w-10 h-10 flex-colo bg-opacity-10 rounded-md ${card.color[1]} ${card.color[0]}`}
              >
                <card.icon />
              </div>
              <h2 className="text-sm font-medium">{card.title}</h2>
            </div>
            <div className="grid grid-cols-8 gap-4 mt-4 bg-dry py-5 px-8 items-center rounded-xl">
              <div className="col-span-5">
                {/* statistic */}
                <DashboardSmallChart data={card.datas} colors={card.color[2]} />
              </div>
              <div className="flex flex-col gap-4 col-span-3">
                <h4 className="text-md font-medium">
                  {card.value}
                  {
                    // if the id === 4 then add the $ sign
                    card.id === 4 ? '$' : '+'
                  }
                </h4>
                <p className={`text-sm flex gap-2 ${card.color[1]}`}>
                  {card.percent > 50 && <BsArrowUpRight />}
                  {card.percent > 30 && card.percent < 50 && (
                    <BsArrowDownRight />
                  )}
                  {card.percent < 30 && <BsArrowDownLeft />}
                  {card.percent}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full my-6 grid xl:grid-cols-8 grid-cols-1 gap-6">
        <div className="xl:col-span-6  w-full">
          <div className="bg-white rounded-xl border-[1px] border-border p-5">
            <div className="flex-btn gap-2">
              <h2 className="text-sm font-medium">Earning Reports</h2>
            </div>
            {/* Earning Reports */}
            <div className="mt-4">
              <DashboardBigChart months={dashboardData.paymentsCount.monthNames} monthsCount={dashboardData.paymentsCount.monthlyAmounts} />
            </div>
          </div>
          {/* transaction */}
          <div className="mt-6 bg-white rounded-xl border-[1px] border-border p-5">
            <div className="flex-btn gap-2">
              <h2 className="text-sm font-medium">Recent Transaction</h2>
            </div>
            {/* table */}
            <div className="mt-4 overflow-x-scroll">
              <Transactiontable
                data={payment}
                action={false}
              />
            </div>
          </div>
        </div>
        {/* side 2 */}
        <div
          data-aos="fade-left"
          data-aos-duration="1000"
          data-aos-delay="10"
          data-aos-offset="200"
          className="xl:col-span-2 xl:block grid sm:grid-cols-2 gap-6"
        >
          {/* recent patients */}
          <div className="bg-white rounded-xl border-[1px] border-border p-5">
            <h2 className="text-sm font-medium">Recent Patients</h2>
            {patient.map((patient, index) => (
              <Link
                to={`/patients/preview/${patient.id}`}
                key={index}
                className="flex-btn gap-4 mt-6 border-b pb-4 border-border"
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={`data:image/jpeg;base64,${patient.img_data}`}
                    alt="member"
                    className="w-10 h-10 rounded-md object-cover"
                  />
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xs font-medium">{patient.name}</h3>
                    <p className="text-xs text-gray-400">{patient.phone}</p>
                  </div>
                </div>
                <p className="text-xs text-textGray">{patient.formatted_time}</p>
              </Link>
            ))}
          </div>
          {/* today appointments */}
          {appointment.length > 0 && (
            <div className="bg-white rounded-xl border-[1px] border-border p-5 xl:mt-6">
              <h2 className="text-sm mb-4 font-medium">Today Appointments</h2>

              {appointment.map((appointment, index) => (
                <div
                  key={appointment.id}
                  className="grid grid-cols-12 gap-2 items-center"
                >
                  <p className="text-textGray text-[12px] col-span-3 font-light">
                    {appointment.time_difference}
                  </p>
                  <div className="flex-colo relative col-span-2">
                    <hr className="w-[2px] h-20 bg-border" />
                    <div
                      className={`w-7 h-7 flex-colo text-sm bg-opacity-10
                       ${
                         appointment.status === 'pending' &&
                         'bg-orange-500 text-orange-500'
                       }
                      ${
                        appointment.status === 'cancelled' && 'bg-red-500 text-red-500'
                      }
                      ${
                        appointment.status === 'approved' &&
                        'bg-green-500 text-green-500'
                      }
                       rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
                    >
                      {appointment.status === 'pending' && <BsClockFill />}
                      {appointment.status === 'cancelled' && <BsXCircleFill />}
                      {appointment.status === 'approved' && <BsCheckCircleFill />}
                    </div>
                  </div>
                  <Link
                    to="/appointments"
                    className="flex flex-col gap-1 col-span-6"
                  >
                    <h2 className="text-xs font-medium">
                      {appointment.patient_name}
                    </h2>
                    <p className="text-[12px] font-light text-textGray">
                      {appointment.start_time} - {appointment.end_time}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
