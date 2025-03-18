import Footer from '@/components/footer';
import Navbar from '@/components/navbar';

const PageLayout = ({
    children
} : {
    children: React.ReactNode;
}) => {

    return (
        <div>   
            <Navbar />
            <main> {children} </main>
            <Footer />
        </div>
    );
};

export default PageLayout;