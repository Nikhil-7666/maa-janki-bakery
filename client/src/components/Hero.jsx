import home from "./home.jpg";
import { Link } from "react-router-dom";
import white_arrow_icon from "./white_arrow_icon.png";

const Hero = () => {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-lg">
      {/* Desktop Image */}
      <img
        src={home}
        alt="Fresh groceries and snacks"
        className="hidden md:block w-full h-[520px] object-cover object-center"
      />

      {/* Mobile Image */}
      <img
        src={home}
        alt="Fresh groceries and snacks"
        className="block md:hidden w-full h-[420px] object-cover object-center"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col items-center justify-end pb-10 px-4 text-center">
        <h1 className="text-white text-2xl md:text-4xl font-semibold leading-tight max-w-2xl">
          Fresh deals delivered fast — shop today’s best picks.
        </h1>
        <div className="mt-6 flex gap-3 flex-wrap justify-center">
          <Link
            to="/products"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white cursor-pointer hover:bg-primary/90 transition"
          >
            Shop Now
            <img src={white_arrow_icon} alt="arrow" className="h-4 w-4" />
          </Link>
          <Link
            to="/products"
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-white text-white cursor-pointer hover:bg-white hover:text-primary transition"
          >
            Explore Deals
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
