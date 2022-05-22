import React, { useEffect } from "react";
import { Alert, Button, Offcanvas, Accordion, Pagination, ButtonGroup } from 'react-bootstrap';
import { Collapse } from 'bootstrap'
import equal from 'fast-deep-equal'

class Header extends React.Component {
  render() {
    return (
      <header id="header" class="content">
        <div class="header-left content-left">
          <div class="text-center">
            <p>Live system by</p>
            <img src="/Images/logo.svg?v=1.0.0" alt="Amitech" class="logo" />
          </div>
        </div>
        <div class="header-center content-center">
          <div class="wrapper">
            <h1 class="page-title text-center">Hanoi GM and IM Chess Tournament 2022</h1>
            <div class="list-select clearfix">
              <div class="item float-left">
                <select>
                  <option value="">Select round...</option>
                </select>
              </div>
              <div class="item float-left">
                <select>
                  <option value="">Select game...</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="header-right content-right">
          <p class="label-date">Date: 2022.05.11</p>
        </div>
      </header>
    );
  }
}
export default Header;