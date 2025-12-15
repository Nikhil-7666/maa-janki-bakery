const Footer = () => {
    const linkSections = [
        {
            title: "Quick Links",
            links: ["Home",  	 "Contact Us", "FAQs"]
        },
        {
            title: "Need Help?",
            links: ["Delivery Information", "Return & Refund Policy", "Payment Methods", "Track your Order", "Contact Us"]
        },
        {
            title: "Follow Us",
            links: [
                { name: "Instagram", url: "https://www.instagram.com/maa_janki_bakery?igsh=MTBucXVucXZhNXl0OA==" },
                { name: "Facebook", url: "#" },
            ]
        }
    ];

    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-32">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
                <div>
                    <h2 className="font-semibold text-2xl md:text-3xl text-gray-900">Maa Janki Store</h2>
                    <p className="text-sm md:text-base mt-2">Sweeten Your Day With Our Treats!</p>
                </div>
                <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
                    {linkSections.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">{section.title}</h3>
                            <ul className="text-sm space-y-1">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        {typeof link === "string" ? (
                                            <a href="#" className="hover:underline transition">{link}</a>
                                        ) : (
                                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:underline transition">
                                                {link.name}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <p className="py-4 text-center text-sm md:text-base text-gray-500/80">
                Copyright 2025 © Maa Janki Bakery & Farsan Store. All Rights Reserved.
            </p>
        </div>
    );
};

export default Footer;
