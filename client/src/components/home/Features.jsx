import React from 'react'

const Features = () => {
    return (
        <section className="text-gray-100 relative">
            <div
                className="
        absolute 
        rounded-full 
        -z-10 
        blur-[60px] 
        opacity-25 
        bg-[#4d5461] 
        max-sm:hidden

        w-[20rem] h-[20rem] top-[70rem] left-[5rem]    /* Mobile default */

        sm:w-[30rem] sm:h-[30rem] sm:top-[65rem] sm:left-[10rem]   /* Small screens */
        md:w-[35rem] md:h-[35rem] md:top-[68rem] md:left-[15rem]   /* Medium screens */
        lg:w-[40rem] lg:h-[40rem] lg:top-[70rem] lg:left-[25rem]   /* Large screens */
    "
                id="fadedCircle"
            ></div>
            <div className="container max-w-xl p-6 py-12 mx-auto space-y-24 lg:px-8 lg:max-w-7xl">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-center sm:text-5xl text-gray-200">
                        Discover Engaging Stories
                    </h2>
                    <p className="max-w-3xl mx-auto mt-4 text-xl text-center text-gray-400">
                        Explore insightful blogs on technology, lifestyle, and creativity.
                    </p>
                </div>

                {/* First Feature Row */}
                <div className="grid lg:gap-8 lg:grid-cols-2 lg:items-center">
                    <div>
                        <h3 className="text-2xl font-bold tracking-tight sm:text-3xl text-gray-200">
                            Why Read Our Blogs?
                        </h3>
                        <p className="mt-3 text-lg text-gray-400">
                            Stay updated with the latest trends, expert opinions, and in-depth articles on various topics.
                        </p>
                        <div className="mt-12 space-y-12">
                            {[{
                                title: "Expert Insights",
                                text: "Gain valuable knowledge from industry experts and experienced writers.",
                            }, {
                                title: "Diverse Topics",
                                text: "From tech updates to lifestyle tips, find articles that match your interests.",
                            }].map((item, i) => (
                                <div className="flex" key={i}>
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center w-12 h-12 rounded-md bg-[#31473a] text-gray-50">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                    strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-lg font-medium leading-6 text-gray-200">{item.title}</h4>
                                        <p className="mt-2 text-gray-400">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div aria-hidden="true" className="mt-10 lg:mt-0 w-full max-w-lg mx-auto">
                        <img
                            src="https://images.unsplash.com/photo-1551042710-de601b4dcdc3?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Blogging"
                            className="rounded-lg shadow-lg bg-gray-500 w-full h-[32rem] object-cover"
                        />
                    </div>
                </div>

                {/* Second Feature Row */}
                <div className="grid lg:gap-8 lg:grid-cols-2 lg:items-center">
                    <div className="lg:col-start-2">
                        <h3 className="text-2xl font-bold tracking-tight sm:text-3xl text-gray-200">
                            Join Our Community
                        </h3>
                        <p className="mt-3 text-lg text-gray-400">
                            Become a part of our growing community of readers and writers.
                        </p>
                        <div className="mt-12 space-y-12">
                            {[{
                                title: "Building a Greener Tomorrow",
                                text: "Practical tips and inspiring stories for eco-conscious living. Learn how to reduce your impact and embrace sustainability.",
                            }, {
                                title: "Write With Us",
                                text: "Share your thoughts and experiences by contributing your own articles.",
                            }].map((item, i) => (
                                <div className="flex" key={i}>
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center w-12 h-12 rounded-md bg-[#31473a] text-gray-50">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                    strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-lg font-medium leading-6 text-gray-200">{item.title}</h4>
                                        <p className="mt-2 text-gray-400">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-10 lg:mt-0 lg:col-start-1 lg:row-start-1 w-full max-w-lg mx-auto">
                        <img
                            src="https://images.unsplash.com/photo-1518406537068-308f1590a298?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Community"
                            className="rounded-lg shadow-lg bg-gray-500 w-full h-[32rem] object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Features
