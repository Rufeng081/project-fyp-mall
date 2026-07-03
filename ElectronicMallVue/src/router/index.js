import Vue from 'vue'
import VueRouter from 'vue-router'
import request from '../utils/request';


Vue.use(VueRouter)
//requireAuth: whether login is required
const routes = [
    //Storefront
  {
    path: '/',
    name: 'front',
    redirect: "/topview",
    component: () => import('../views/front/Front.vue'),
    meta: {title:'R Mall | FYP E-Commerce System', path: 'R Mall', requireAuth: false},
    children: [
      {path: 'person', name: 'person', meta: {title:'Profile',requireLogin: true}, component: () => import('../views/Person.vue'),},
      {path: 'topview', name: 'topview', meta: {title:'R Mall | FYP E-Commerce System'}, component: () => import('../views/front/TopView.vue'),},
      {path: 'cart', name: 'cart', meta: {title:'My Cart',requireLogin: true}, component: () => import('../views/front/good/Cart.vue'),},
      {path: 'goodList', name: 'goodList', meta: {title:'Product List'}, component: () => import('../views/front/good/GoodList.vue'),},
      {path: 'goodView/:goodId', name: 'goodview', meta: {title:'Product Details'}, component: () => import('../views/front/good/GoodView.vue'),},
      {path: 'preOrder', name: 'preOrder', meta: {title:'Confirm Order',requireLogin: true}, component: () => import('../views/front/order/PreOrder.vue'),},
      {path: 'pay', name: 'pay', meta: {title:'Pay',requireLogin: true}, component: () => import('../views/front/order/Pay.vue'),},
      {path: 'orderList', name: 'orderList', meta: {title:'My Orders',requireLogin: true}, component: () => import('../views/front/order/OrderList.vue'),},

    ]
  },
    //Admin
  {
    path: '/manage',
    name: 'manage',
    component: () => import('../views/manage/Manage.vue'),
    redirect: "/manage/home",
    meta: {title:'Admin', path: 'Admin',requireAuth: true},
    children: [
      {path: 'home', name: 'home', meta: {title:'Dashboard', path: 'Dashboard',requireAuth: true}, component: () => import('../views/manage/Home.vue'),},
      {path: 'user', name: 'user', meta: {title:'User Management',path: 'System/User Management',requireAuth: true}, component: () => import('../views/manage/User.vue'),},
      {path: 'person', name: 'person', meta: {title:'Profile',path: 'Profile',requireAuth: true}, component: () => import('../views/Person.vue'),},
      {path: 'file', name: 'file', meta: {title:'File Management',path: 'File/File Management',requireAuth: true}, component: () => import('../views/manage/file/File.vue'),},
      {path: 'avatar', name: 'avatar', meta: {title:'Avatar Management',path: 'File/Avatar Management',requireAuth: true}, component: () => import('../views/manage/file/Avatar.vue'),},
      {path: 'carousel', name: 'carousel', meta: {title:'Carousel Management',path: 'Product/Carousel Management',requireAuth: true}, component: () => import('../views/manage/good/Carousel.vue'),},
      {path: 'category', name: 'category', meta: {title:'Category Management',path: 'Product/Category Management',requireAuth: true}, component: () => import('../views/manage/good/Category.vue'),},
      {path: 'good', name: 'good', meta: {title:'Product Management',path: 'Product/Product Management',requireAuth: true}, component: () => import('../views/manage/good/Goods.vue'),},
      {path: 'goodInfo', name: 'goodInfo', meta: {title:'Product Management',path: 'Product/Product Management/Product Information',requireAuth: true}, component: () => import('../views/manage/good/GoodInfo.vue'),},
      {path: 'order', name: 'order', meta: {title:'Order Management',path: 'Product/Order Management',requireAuth: true}, component: () => import('../views/manage/Order.vue'),},
      {path: 'incomeChart', name: 'incomeChart', meta: {title:'Revenue Charts',path: 'Revenue/Revenue Charts',requireAuth: true}, component: () => import('../views/manage/income/IncomeChart.vue'),},
      {path: 'incomeRank', name: 'incomeRank', meta: {title:'Revenue Ranking',path: 'Revenue/Revenue Ranking',requireAuth: true}, component: () => import('../views/manage/income/IncomeRank.vue'),},

    ]
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login',
      requireAuth: false,
    },
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    meta: {
      title: 'Register',requireAuth: false,
    },
    component: () => import(/* webpackChunkName: "about" */ '../views/Register.vue')
  },
  {
    path: '/*',
    name: 'notFound',
    meta: {
      title: 'Page Not Found'
    },
    component: () => import(/* webpackChunkName: "about" */ '../views/404NotFound.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// Runs before route navigation.
router.beforeEach((to, from, next) => {
  // if(to.path === '/manage'){
  //   let user = localStorage.getItem("user");
  //   if(!user.token){
  //     next('/login');
  //   }
  // }
  let role;
  let allow = false;
  if(to.meta.requireAuth===true){
    // Get the current user's role from the API.
    request.post("/role").then(res=>{
      if(res.code==='200'){
        role = res.data;
        console.log('Your role is: '+role);
        if(role === 'admin'){
          allow = true;
        }
        else if(role==='user'){
            alert("You do not have permission");
            allow = false;
            next("/")
        }
      }
      else{  //Role lookup failed
        alert(res.msg);
        next('/login');
      }
      //Allow route
      if(allow === true){
        //Set page title
        if (to.meta.title) {
          document.title = to.meta.title
        } else {
          document.title ='Unknown Page'
        }
        next()
      }
    }
    )
  }
  else{    //Authorization not required
    if(to.meta.requireLogin===true){
      if(!isLogin()){
        return next('/login');
      }
    }
    if (to.meta.title) {
      document.title = to.meta.title
    } else {
      document.title ='Unknown Page'
    }
    return next()
  }

})

function isLogin() {
  let user = localStorage.getItem("user");
  if(user){
    return true;
  }else{
    return false;
  }
}
export default router
