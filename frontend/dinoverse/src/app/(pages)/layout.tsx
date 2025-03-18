import Footer from '@/components/footer';
import Navbar from '@/components/navbar';

const PageLayout = ({
    children
} : {
    children: React.ReactNode;
}) => {

    return (
        <div className={`h-screen flex flex-col overflow-y-clip`}>
            <Navbar />
            <main className='absolute top-16 bottom-16 w-full py-4 overflow-y-scroll'> {children} </main>
            <Footer />
        </div>
    );
};

export default PageLayout;