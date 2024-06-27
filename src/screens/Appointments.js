import React from 'react';
import Layout from '../Layout';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { BiChevronLeft, BiChevronRight, BiPlus, BiTime } from 'react-icons/bi';
import { HiOutlineViewGrid } from 'react-icons/hi';
import { HiOutlineCalendarDays } from 'react-icons/hi2';
import AddAppointmentModal from '../components/Modals/AddApointmentModal';
import { fetchDoctorAppointments } from '../services/authService';
import Loader from '../components/Notifications/Loader';

// custom toolbar
const CustomToolbar = (toolbar) => {
  // today button handler
  const goToBack = () => {
    toolbar.date.setMonth(toolbar.date.getMonth() - 1);
    toolbar.onNavigate('prev');
  };

  // next button handler
  const goToNext = () => {
    toolbar.date.setMonth(toolbar.date.getMonth() + 1);
    toolbar.onNavigate('next');
  };

  // today button handler
  const goToCurrent = () => {
    toolbar.onNavigate('TODAY');
  };

  // month button handler
  const goToMonth = () => {
    toolbar.onView('month');
  };

  // week button handler
  const goToWeek = () => {
    toolbar.onView('week');
  };

  // day button handler
  const goToDay = () => {
    toolbar.onView('day');
  };

  // view button group
  const viewNamesGroup = [
    { view: 'month', label: 'Month' },
    { view: 'week', label: 'Week' },
    { view: 'day', label: 'Day' },
  ];

  return (
    <div className="flex flex-col gap-8 mb-8">
      <h1 className="text-xl font-semibold">Appointments</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-12 gap-4">
        <div className="md:col-span-1 flex sm:justify-start justify-center items-center">
          <button
            onClick={goToCurrent}
            className="px-6 py-2 border border-subMain rounded-md text-subMain"
          >
            Today
          </button>
        </div>
        {/* label */}
        <div className="md:col-span-9 flex-rows gap-4">
          <button onClick={goToBack} className="text-2xl text-subMain">
            <BiChevronLeft />
          </button>
          <span className="text-xl font-semibold">
            {moment(toolbar.date).format('MMMM YYYY')}
          </span>
          <button onClick={goToNext} className="text-2xl text-subMain">
            <BiChevronRight />
          </button>
        </div>
        {/* filter */}
        <div className="md:col-span-2 grid grid-cols-3 rounded-md  border border-subMain">
          {viewNamesGroup.map((item, index) => (
            <button
              key={index}
              onClick={
                item.view === 'month'
                  ? goToMonth
                  : item.view === 'week'
                    ? goToWeek
                    : goToDay
              }
              className={`border-l text-xl py-2 flex-colo border-subMain ${toolbar.view === item.view
                  ? 'bg-subMain text-white'
                  : 'text-subMain'
                }`}
            >
              {item.view === 'month' ? (
                <HiOutlineViewGrid />
              ) : item.view === 'week' ? (
                <HiOutlineCalendarDays />
              ) : (
                <BiTime />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

function Appointments() {
  const localizer = momentLocalizer(moment);
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState({});
  const [appointments, setAppointments] = React.useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = React.useState(true);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = user.token;
  const userRole = user.role;

  // handle modal close
  const handleClose = () => {
    setOpen(!open);
    setData({});
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetchDoctorAppointments(token);
      setAppointments(response.data);
      setAppointmentsLoading(false);
    }
    catch (err) {
      console.error('Error fetching data:', err.message);
    } finally {
      setAppointmentsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAppointments();
  }, []);

  const events = appointments.map((item, index) => ({
    id: index,
    start: moment(`${item.Date} ${item.Start_time}`, 'MMM D, YYYY HH:mm:ss').toDate(),
    end: moment(`${item.Date} ${item.End_time}`, 'MMM D, YYYY HH:mm:ss').toDate(),
    color: '#FB923C',
    title: item.Patient.name,
    message: item.Description,
    service: item.Treatment,
    shareData: {
      email: true,
      sms: true,
      whatsapp: false,
    },
    originalData: item,
  }));

  // onClick event handler
  const handleEventClick = (event) => {
    setData(event.originalData);
    setOpen(!open);
    console.log(event.originalData);
  };

  if (appointmentsLoading) {
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
      {open && (
        <AddAppointmentModal
          datas={data}
          isOpen={open}
          mode="preview"
          closeModal={() => {
            handleClose();
          }}
        />
      )}
      {/* calender */}
      {['admin', 'receptionist'].includes(userRole) && (
        <button
          onClick={handleClose}
          className="w-16 animate-bounce h-16 border border-border z-50 bg-subMain text-white rounded-full flex-colo fixed bottom-8 right-12 button-fb"
        >
          <BiPlus className="text-2xl" />
        </button>
      )}

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{
          // height fix screen
          height: 900,
          marginBottom: 50,
        }}
        onSelectEvent={(event) => handleEventClick(event)}
        defaultDate={new Date()}
        timeslots={1}
        resizable
        step={60}
        selectable={true}
        // custom event style
        eventPropGetter={(event) => {
          const style = {
            backgroundColor: '#66B5A3',

            borderRadius: '10px',
            color: 'white',
            border: '1px',
            borderColor: '#F2FAF8',
            fontSize: '12px',
            padding: '5px 5px',
          };
          return {
            style,
          };
        }}
        // custom date style
        dayPropGetter={(date) => {
          const backgroundColor = 'white';
          const style = {
            backgroundColor,
          };
          return {
            style,
          };
        }}
        // remove agenda view
        views={['month', 'day', 'week']}
        // toolbar={false}
        components={{ toolbar: CustomToolbar }}
      />
    </Layout>
  );
}

export default Appointments;
