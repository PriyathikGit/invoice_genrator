import InvoiceForm from "@/components/form/InvoiceForm";
import { ToastContainer } from "react-toastify";

export default function Home() {
  return (
    <main className="w-full h-full md:h-screen bg-slate-900 text-white">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-8 text-center py-6">Create New Invoice</h1>
      <InvoiceForm />
    </main>
  );
}
