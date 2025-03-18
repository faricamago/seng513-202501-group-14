import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import { navbarHeight, footerHeight } from '../tailwind-globals';

const PageLayout = ({
    children
} : {
    children: React.ReactNode;
}) => {

    return (
        <div className={`h-screen flex flex-col overflow-y-clip`}>
            <Navbar />
            <main className={`absolute top-${navbarHeight} bottom-${footerHeight} w-full py-4 overflow-y-scroll`}> {children} </main>
            <Footer />
        </div>
    );
};

export default PageLayout;