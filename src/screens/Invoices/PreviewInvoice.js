import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../Layout';
import { toast } from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import { IoArrowBackOutline } from 'react-icons/io5';
import { FiEdit } from 'react-icons/fi';
import { MdOutlineCloudDownload } from 'react-icons/md';
import { AiOutlinePrinter } from 'react-icons/ai';
import PaymentModal from '../../components/Modals/PaymentModal';
import { RiShareBoxLine } from 'react-icons/ri';
import ShareModal from '../../components/Modals/ShareModal';
import SenderReceverComp from '../../components/SenderReceverComp';
import { InvoiceProductsTable } from '../../components/Tables';
import { fetchInvoiceDetails } from '../../services/authService';
import Loader from '../../components/Notifications/Loader';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function PreviewInvoice() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState([]);
  const [isOpen, setIsoOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const invoiceRef = useRef();
  const taxRate = 0.065;

  const user = JSON.parse(localStorage.getItem('user'));
  const token = user.token;
  const userRole = user.role;

  const isPatient = userRole === 'patient';

  const buttonClass =
    'bg-subMain flex-rows gap-3 bg-opacity-5 text-subMain rounded-lg border border-subMain border-dashed px-4 py-3 text-sm';

  const fetchDetails = async () => {
    try {
      const response = await fetchInvoiceDetails(id, token);
      setInvoice(response.data);
      setLoading(false);
    }
    catch (err) {
      console.error('Error fetching data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleDownload = () => {
    const doc = new jsPDF();

    doc.text('Invoice', 20, 20);
    doc.text(`Invoice ID: ${invoice.id}`, 20, 30);
    doc.text(`Date: ${invoice.created_at}`, 20, 40);
    doc.text(`Due Date: ${invoice.due_date}`, 20, 50);

    const items = [
      {
        id: `${invoice.treatment.name} (Treatment)`,
        name: invoice.treatment.name,
        price: invoice.treatment.price,
        quantity: 1,
      },
      ...invoice.prescription.map((prescription, index) => ({
        id: `${index}.  ${prescription.medicine_name} (Medicine)`,
        name: prescription.medicine_name,
        price: prescription.price,
        quantity: prescription.quantity,
      }))
    ];


    doc.autoTable({
      startY: 60,
      head: [['Item', 'Price', 'Quantity', 'Amount']],
      body: items.map((item) => [
        item.id,
        item.price,
        item.quantity,
        (item.price * item.quantity).toFixed(2)
        ,
      ]),
    });

    doc.text(`Sub Total: ${invoice.amount}`, 20, doc.previousAutoTable.finalY + 10);
    doc.text(`Discount: ${invoice.discount}`, 20, doc.previousAutoTable.finalY + 20);
    doc.text(`Tax: ${(invoice.amount * taxRate).toFixed(2)} (6.5%)`, 20, doc.previousAutoTable.finalY + 30);
    doc.text(`Grand Total: ${(invoice.amount - invoice.discount + (invoice.amount * taxRate)).toFixed(2)}`, 20, doc.previousAutoTable.finalY + 40);

    doc.save(`invoiceDetails_${invoice.id}.pdf`);
  };

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
  });

  if (loading) {
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
      {isOpen && (
        <PaymentModal
          isOpen={isOpen}
          closeModal={() => {
            setIsoOpen(false);
          }}
        />
      )}
      {isShareOpen && (
        <ShareModal
          isOpen={isShareOpen}
          closeModal={() => {
            setIsShareOpen(false);
          }}
        />
      )}
      <div className="flex-btn flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/invoices"
            className="bg-white border border-subMain border-dashed rounded-lg py-3 px-4 text-md"
          >
            <IoArrowBackOutline />
          </Link>
          <h1 className="text-xl font-semibold">Preview Invoice</h1>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {/* button */}
          {!isPatient && (
            <button
              onClick={() => {
                setIsShareOpen(true);
              }}
              className={buttonClass}
            >
              Share <RiShareBoxLine />
            </button>)}
          <button
            onClick={handleDownload}
            className={buttonClass}
          >
            Download <MdOutlineCloudDownload />
          </button>
          <button
            onClick={handlePrint}
            className={buttonClass}
          >
            Print <AiOutlinePrinter />
          </button>
          {!isPatient && (
            <>
              <Link to={`/invoices/edit/` + invoice?.id} className={buttonClass}>
                Edit <FiEdit />
              </Link>
              <button
                onClick={() => {
                  setIsoOpen(true);
                }}
                className="bg-subMain text-white rounded-lg px-6 py-3 text-sm"
              >
                Generate To Payment
              </button>
            </>)}
        </div>
      </div>
      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="100"
        data-aos-offset="200"
        className="bg-white my-8 rounded-xl border-[1px] border-border p-5"
      >
              <div
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="100"
        data-aos-offset="200"
        className="bg-white my-8 rounded-xl border-[1px] border-border p-5"
        ref={invoiceRef}
      >
        {/* header */}
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-2 items-center">
          <div className="lg:col-span-3">
            <img
              src="/images/logo.png"
              alt="logo"
              className=" w-32 object-contain"
            />
          </div>

          <div className="flex flex-col gap-4 sm:items-end">
            <h6 className="text-xs font-medium">#{invoice?.id}</h6>

            <div className="flex gap-4">
              <p className="text-sm font-extralight">Date:</p>
              <h6 className="text-xs font-medium">{invoice?.created_at}</h6>
            </div>
            <div className="flex gap-4">
              <p className="text-sm font-extralight">Due Date:</p>
              <h6 className="text-xs font-medium">{invoice?.due_date}</h6>
            </div>
          </div>
        </div>
        {/* sender and recever */}
        <SenderReceverComp item={invoice.patient} functions={{}} button={false} />
        {/* products */}
        <div className="grid grid-cols-6 gap-6 mt-8">
          <div className="lg:col-span-4 col-span-6 p-6 border border-border rounded-xl overflow-hidden">
            <InvoiceProductsTable
              data={invoice}
              functions={{}}
              button={false}
            />
          </div>
          <div className="col-span-6 lg:col-span-2 flex flex-col gap-6">
            <div className="flex-btn gap-4">
              <p className="text-sm font-extralight">Currency:</p>
              <h6 className="text-sm font-medium">USD ($)</h6>
            </div>
            <div className="flex-btn gap-4">
              <p className="text-sm font-extralight">Sub Total:</p>
              <h6 className="text-sm font-medium">{invoice.amount}</h6>
            </div>
            <div className="flex-btn gap-4">
              <p className="text-sm font-extralight">Discount:</p>
              <h6 className="text-sm font-medium">{invoice.discount}</h6>
            </div>
            <div className="flex-btn gap-4">
              <p className="text-sm font-extralight">Tax:</p>
              <h6 className="text-sm font-medium">{`${(invoice.amount * taxRate).toFixed(2)} (6.5%)`}</h6>
            </div>
            <div className="flex-btn gap-4">
              <p className="text-sm font-extralight">Grand Total:</p>
              <h6 className="text-sm font-medium text-green-600">{(invoice.amount - invoice.discount + (invoice.amount * taxRate)).toFixed(2)}</h6>
            </div>
            {/* notes */}
            <div className="w-full p-4 border border-border rounded-lg">
              <h1 className="text-sm font-medium">Notes</h1>
              <p className="text-xs mt-2 font-light leading-5">
                Thank you for your business. We hope to work with you again
                soon. You can pay your invoice online at
                www.MedJunction_/pay
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
}

export default PreviewInvoice;
