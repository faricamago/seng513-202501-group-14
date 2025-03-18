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
            <main className={`absolute top-${navbarHeight} bottom-${footerHeight} w-full bg-[var(--verylight-pink)] overflow-y-scroll py-4 px-8`}> {children} </main>
            <Footer />
        </div>
    );
};

export default PageLayout;