import Footer from '@/components/footer';
import Navbar from '@/components/navbar';

const PageLayout = ({
    children
} : {
    children: React.ReactNode;
}) => {

    return (
        <div className={`h-screen w-screen flex flex-col overflow-y-clip`}>
            <Navbar/>
            <main className={`absolute top-20 bottom-16 w-full z-0 bg-[var(--verylight-pink)] overflow-y-scroll py-4 px-32`}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default PageLayout;