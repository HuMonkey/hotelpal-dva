import dva from 'dva';
import './index.less';

import {getToken} from './utils';
import createHistory from 'history/createBrowserHistory';

// 1. Initialize
const app = dva({
    history: createHistory(),
});

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/common'));
if (getToken ()) {
    app.model(require('./models/index'));
    app.model(require('./models/bought'));
    app.model(require('./models/profile'));
    app.model(require('./models/jdbs'));
    app.model(require('./models/course'));
    app.model(require('./models/lesson'));
    app.model(require('./models/hongbao'));
    app.model(require('./models/live'));
    app.model(require('./models/coupon'));
    app.model(require('./models/invite'));
}

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');