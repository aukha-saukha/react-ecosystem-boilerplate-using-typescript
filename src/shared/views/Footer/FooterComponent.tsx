import * as React from 'react';
import { NavLink } from 'react-router-dom';

import { FOOTER_LINKS } from '../../../data/views-schema/footer';
import FooterStyle from './Footer.scss';

const FooterComponent: React.FC<{}> = (): JSX.Element => (
  <footer
    className={`display-flex flex-items-align-center padding-all-15 ${FooterStyle['footer']}`}
  >
    <nav>
      <ul className="display-flex">
        {FOOTER_LINKS.map((footerLink) => (
          <li key={footerLink.name}>
            <NavLink data-test={footerLink.dataTest} to={footerLink.linkToLocation}>
              {footerLink.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  </footer>
);

export default FooterComponent;
