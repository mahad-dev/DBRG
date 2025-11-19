import MemberTable from './comps/MemberTable'

export default function MemberShipTable() {
  return (
    <div className='pt-28 mx-auto p-16 max-w-7xl'>
       <h2
          className="text-center sm:text-left text-[#C6A95F] text-[48px] leading-[100%] font-normal mb-10"
          style={{
            fontFamily: "DM Serif Display",
            fontWeight: 400,
            letterSpacing: "0px",
          }}
        >
          Member List
        </h2>
      <MemberTable/>
      </div>
  )
}
