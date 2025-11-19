export default function Address() {
  return (
    <section className="w-full bg-[#0f0f0f] text-white py-16 px-4 sm:px-6 md:px-12 lg:px-20 flex flex-col items-center">
      
      {/* Title */}
      <h2
        className="text-[42px] sm:text-[50px] md:text-[62px] font-normal leading-tight text-[#C6A95F] mb-4 text-center md:text-left w-full"
        style={{ fontFamily: 'DM Serif Display' }}
      >
        Address
      </h2>

      {/* Subtitle */}
      <p
        className="text-center md:text-left text-gray-300 font-gilory-medium mb-10 text-[18px] sm:text-[20px] md:text-[24px] leading-snug"
      >
        Our office is located in the heart of Dubai, and we would love to meet you in person.
        Below is our office location on Google Maps for easy navigation.
      </p>

      {/* Map */}
      <div className="w-full h-64 sm:h-80 md:h-[400px] rounded-2xl overflow-hidden shadow-lg">
        <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3620.0306921186524!2d67.03617697534279!3d24.85715557792615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33fdd7700ad6b%3A0xaea0a0d0b2ecfac1!2sKarachi%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  );
}
