import dva from 'dva';
import './index.less';

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/common'));
app.model(require('./models/index'));
app.model(require('./models/bought'));
app.model(require('./models/profile'));
app.model(require('./models/jdbs'));
app.model(require('./models/course'));
app.model(require('./models/lesson'));
app.model(require('./models/hongbao'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
