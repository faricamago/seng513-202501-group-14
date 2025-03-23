import Footer from '@/components/footer';
import Header from '@/components/header';

const PageLayout = ({
    children
} : {
    children: React.ReactNode;
}) => {

    return (
        <div className={`h-screen w-screen flex flex-col overflow-y-clip`}>
            <Header/>
            {/* <main className={`absolute top-20 bottom-16 w-full z-0 bg-white overflow-y-scroll py-4 px-32`}> */}
            <main className={`absolute top-20 bottom-16 w-full z-0 bg-white overflow-y-scroll py-4 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32`}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default PageLayout;