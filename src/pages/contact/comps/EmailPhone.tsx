import React from "react";

export default function EmailPhone() {
  const contacts = [
  { label: "General Inquiries", value: "[Email Address]" },
  { label: "Phone Number", value: "[Phone Number]" },
  { label: "Membership Inquiries", value: "[Email Address]" },
  { label: "Office Address", value: "[Office Address]" },
];
  return (
    <section className="w-full bg-[#0f0f0f] text-white py-16 px-16">
      
{/* Title */}
<h2
  className="text-[58px] font-normal leading-[100%] text-[#C6A95F] mb-3"
  style={{ fontFamily: 'DM Serif Display' }}
>
  Key Email &amp; Phone Contacts
</h2>


<p
  className="text-left mx-auto mb-10 text-[22px] leading-[100%] font-gilory-medium"
>
  If you prefer to contact us directly, feel free to reach out through the following
  communication channels:
</p>


      {/* Contacts Grid */}
     <div className="grid grid-cols-1 md:grid-cols-2 gap-y-9 gap-x-12 text-[30px] leading-[100%] font-gilory mt-16" >
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
