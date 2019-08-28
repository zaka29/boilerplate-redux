/*

This is boilerplate for CodeSplitting epic FE-767
https://minergroup.atlassian.net/browse/FE-767

For instructions visit
https://minergroup.atlassian.net/wiki/spaces/TECH/pages/930775517/CodeSplitting+How+to+convert+component
https://minergroup.atlassian.net/wiki/spaces/TECH/pages/932643069/Code+Splitting+New+Components+overview

*/

import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import configureComponent from '@helpers/configureComponent.$MODE';
import parseDataAttributes from '@helpers/parseDataAttributes';

// Ensure the paths are correct and imports are unescessary !
import rootReducer from './reducers/index';
import apiMiddleware from './middleware/api';
import __MAIN_COMPONENT_NAME__ from './components/main';
import './styles/index.scss';
//

// You can add wrappers like store or router here
const root = ({ configuredModules, dataAttributes }) => {
    return <Provider store={configuredModules.store}>
        <__MAIN_COMPONENT_NAME__ {...dataAttributes} />
    </Provider>;
};

root.propTypes = {
    configuredModules: PropTypes.object.isRequired,
    dataAttributes: PropTypes.object.isRequired,
};

// If you dont need apiMiddleware feel free to remove it
const modules = { axios, rootReducer, apiMiddleware };

// The html node will be supplied by the bootstrapper
export default async node => {
    // Use single solution for parsing attributes across the components
    const dataAttributes = parseDataAttributes(node);
    // The configure function depends on the production or development environment
    const configuredModules = await configureComponent(modules);
    const props = { dataAttributes, configuredModules };
    const comp = React.createElement(root, props);

    render(comp, node);
};
