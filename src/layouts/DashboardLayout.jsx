import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from '../components/Footer';
const DashboardLayout = ({children}) => {
    return (
        <> 
            <div>
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="p-4">{children}</main>
            </div>
            
            </div>
        </>
    );
}
export default DashboardLayout;