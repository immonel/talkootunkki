const PrizesPage = () => {

  return (
    <div className="flex flex-col mt-3 w-11/12">
      <h1 className="text-2xl text-center">Prizes</h1>
      <div className="flex mt-6 w-80 self-center">
        <small className="text-center">
          Campus Section rewards hard-working volunteers by handing out various prizes!
          Hours for medals are accumulated across Village Cleanups and are usually 
          awarded at the Village Pre-Christmas Party.
          There will likely also be varying rewards for best-performing individuals and
          associations during a single event!
        </small>
      </div>
      <div className="flex flex-col text-start">
        <h3 className="text-xl text-center mt-4">Personal prizes</h3>
        <div className="flex mt-4 items-center">
          <span className="text-6xl mr-4">🥉</span>
          <div>
            <p>Bronze medal</p>
            <small>Volunteering for 6 hours in total</small>
          </div>
        </div>
        <div className="flex mt-4 items-center">
          <span className="text-6xl mr-4">🥈</span>
          <div>
            <p>Silver medal</p>
            <small>Volunteering for 12 hours in total</small>
          </div>
        </div>
        <div className="flex mt-4 items-center">
          <span className="text-6xl mr-4">🥇</span>
          <div>
            <p>Gold medal</p>
            <small>Volunteering for 24 hours in total</small>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrizesPage