import React from 'react';


let Navbar = () => {
  return (
    <nav className="pt-2 pb-2 fixed-top">
      <div className="container-fluid">
        <div className="row">
          <div className="col-6 v-center">
            <h1><a className="nav-link text-white hover-warning" href="/"><strong><em><img className="logo" alt="" title="" src="./static/icons/cc.svg"/></em></strong></a></h1>
            <br className="d-none" />
            <br className="d-none" />
          </div>
          <div className="col-6 v-center d-flex flex-row-reverse">

          </div>
        </div>
      </div>
    </nav>
  );
};


export default Navbar;
