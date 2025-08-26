import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Feather } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    // Mobile menu animation variants
    const menuVariants = {
        hidden: {
            opacity: 0,
            height: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        },
        visible: {
            opacity: 1,
            height: "auto",
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    return (
        <header className=" backdrop-blur-sm">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center text-white font-bold text-3xl"
                    onClick={() => setIsOpen(false)}
                >
                    <Feather className="mr-2" size={24} />
                    Midnight Blog
                </Link>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-white focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle Menu"
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                    <Link to="/" className="text-gray-300 hover:text-white transition-colors link-underline">Home</Link>
                    <Link to="/blogs" className="text-gray-300 hover:text-white transition-colors link-underline">Blogs</Link>
                    <Link to="/about" className="text-gray-300 hover:text-white transition-colors link-underline">About</Link>
                    <Link to="/contact" className="text-gray-300 hover:text-white transition-colors link-underline">Contact</Link>
                    <Link to="/signin" className="text-gray-300 hover:text-white transition-colors link-underline">Login</Link>
                </nav>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="md:hidden bg-gray-800"
                    >
                        <div className="flex flex-col px-4 py-4 space-y-4">
                            {[
                                { path: "/", label: "Home" },
                                { path: "/blogs", label: "Blogs" },
                                { path: "/about", label: "About" },
                                { path: "/contact", label: "Contact" },
                                { path: "/signin", label: "Login" }
                            ].map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className="w-full text-left text-gray-300 hover:text-white py-2 border-b border-gray-700 last:border-b-0"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;