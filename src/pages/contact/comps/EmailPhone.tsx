export default function EmailPhone() {
  const contacts = [
    { label: "General Inquiries", value: "[Email Address]" },
    { label: "Phone Number", value: "[Phone Number]" },
    { label: "Membership Inquiries", value: "[Email Address]" },
    { label: "Office Address", value: "[Office Address]" },
  ];

  return (
    <section className="w-full bg-[#0f0f0f] text-white py-16 px-4 sm:px-6 md:px-12 lg:px-20">
      
      {/* Title */}
      <h2
        className="text-[38px] sm:text-[46px] md:text-[58px] font-normal leading-tight text-[#C6A95F] mb-4 text-center md:text-left"
        style={{ fontFamily: 'DM Serif Display' }}
      >
        Key Email &amp; Phone Contacts
      </h2>

      {/* Subtitle */}
      <p
        className="text-[18px] sm:text-[20px] md:text-[22px] leading-snug text-gray-300 mb-12 text-center md:text-left font-gilory-medium max-w-3xl"
      >
        If you prefer to contact us directly, feel free to reach out through the following
        communication channels:
      </p>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 text-[24px] sm:text-[26px] md:text-[30px] leading-snug font-gilory">
        {contacts.map((contact, index) => (
          <p key={index} className="font-semibold">
            {contact.label}:{" "}
            <span className="font-normal text-gray-300">{contact.value}</span>
          </p>
        ))}
      </div>
    </section>
  );
}
