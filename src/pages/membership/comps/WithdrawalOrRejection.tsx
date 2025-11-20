export default function WithdrawalOrRejection() {
  return (
    <section className="w-full bg-[#0E0E0E] text-white px-6 md:px-16 py-12 md:py-20">
      
      {/* Title */}
      <h2 className="
        font-gilory-bold
        font-bold
        text-[40px] md:text-[46px] lg:text-[48px]
        leading-[100%]
        mb-12 md:mb-16
        text-center md:text-left
      ">
        Withdrawal or Rejection
      </h2>

      {/* Layout Wrapper */}
      <div className="
        grid grid-cols-1 md:grid-cols-2
        gap-10 md:gap-16
        items-center
      ">
         {/* Left Placeholder Block */}
        {/* <Card
          className="
            w-full
            aspect-square
            bg-[#D3D3D3] /static/placeholder-image.png
            rounded-xl
          "
        /> */}
        {/* Left Image */}
        <div className="mx-auto md:mx-0 w-full max-w-[509px]">
          <img
            src="/static/DBRGLOGO.png"
            alt="Withdrawal or Rejection"
            className="w-full h-auto rounded-[15px] object-cover"
          />
        </div>

        {/* Right Text */}
        <div className="
          font-gilory-medium
          text-[18px] md:text-[20px] lg:text-[22px]
          leading-[150%]
          max-w-xl
          mx-auto md:mx-0
        ">
          <p className="mb-6">
            DBRG reserves the right to reject or withdraw membership if:
          </p>

          <ul className="list-disc ml-6 mb-6 space-y-2">
            <li>False or misleading information is provided</li>
            <li>Significant compliance concerns arise post-approval</li>
            <li>The member is found in breach of DBRG Code of Conduct</li>
          </ul>

          <p className="mb-6">
            Affected parties will be notified in writing with appropriate reasoning.
          </p>

          <p>
            On withdrawal or delisting, member will be moved to former list.
          </p>
        </div>
      </div>
    </section>
  );
}
