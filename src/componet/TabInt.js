import Act from '../page/Act'
import SubAccunt from '../page/SubAccunt'
import 'react-dyn-tabs/style/scss/react-dyn-tabs.scss';
import 'react-dyn-tabs/themes/scss/react-dyn-tabs-card.scss';
import useDynTabs from 'react-dyn-tabs';

const options = {
    tabs: [
      {
        id: '1',
        title: 'کاربران',
        panelComponent: <SubAccunt />,
      },
      {
        id: '2',
        title: 'کارکرد',
        panelComponent: <Act/>,
      },
    ],
    selectedTabID: '1',
  };

  let _instance;
  const [TabList, PanelList, ready] = useDynTabs(options);
  ready((instance) => {
    _instance = instance;
  });