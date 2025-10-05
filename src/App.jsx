import React, { useEffect } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import CartProvider from './Context/CartContext'
import NotificationProvider from './Context/NotificationContext'
import ProductRoute from './components/ProductRoute/ProductRoute'
import NotFoundPage from './components/NotFound/NotFound'
const Layout =React.lazy(()=> import('./components/Layout/Layout'))
const OurProducts = React.lazy(()=> import('./components/OurProducts/OurProducts'))
const Trust = React.lazy(()=> import('./components/Trust/Trust'))
const Brands = React.lazy(()=> import('./components/Brands/Brands'))
const Login = React.lazy(()=> import('./components/Login/Login'))
const Register = React.lazy(()=> import('./components/Register/Register'))
const Waste = React.lazy(()=> import('./components/Waste/Waste'))
const Quotation = React.lazy(()=> import('./components/Quotation/Quotation'))
const Customers = React.lazy(()=> import('./components/Customers/Customers'))
const Categories = React.lazy(()=> import('./components/Categories/Categories'))
const Products = React.lazy(()=> import('./components/Products/Products'))
const Baskets = React.lazy(()=> import('./components/Baskets/Baskets'))
const Catalogs = React.lazy(()=> import('./components/Catalogs/Catalogs'))
const Members = React.lazy(()=> import('./components/Members/Members'))
const ProductManagement = React.lazy(()=> import('./components/ProductManagement/ProductManagement'))
const Main = React.lazy(()=> import('./components/Main/Main'))
const ToDoList = React.lazy(()=> import('./components/ToDoList/ToDoList'))
const SubProductsDetails = React.lazy(()=> import('./components/SubProductsDetails/SubProductsDetails')) 
const CreateProduct = React.lazy(()=> import('./components/ProductManagement/CreateProduct/CreateProduct'))
const MainCategory = React.lazy(()=> import('./components/MainCatgory/MainCatgory'))
const SubCategory = React.lazy(()=> import('./components/SubCategory/SubCategory'))
const AllMainCategory = React.lazy(()=> import('./components/OurProducts/AllMainCategory/AllMainCategory'))
const AllSubCategory = React.lazy(()=> import('./components/OurProducts/AllSubCategory/AllSubCategory'))
const Cart = React.lazy(()=> import('./components/Cart/Cart'))
const ProductDetails = React.lazy(() => import('./components/ProductDetails/ProductDetails'))
const ForgetPassword = React.lazy(() => import('./components/ForgetPassword/ForgetPassword'))
const ResetPassword = React.lazy(() => import('./components/ResetPassword/ResetPassword'))
const VerfiyEmail = React.lazy(() => import('./components/VerfiyEmail/VerfiyEmail'))
const BasketsProducts = React.lazy(() => import('./components/Baskets/BasketsProducts/BasketsProducts'))
const CatalogsProducts = React.lazy(() => import('./components/Catalogs/CatalogsProducts/CatalogsProducts'))
const CompanyFolder = React.lazy(()=> import('./components/Customers/UpdateClientDialog/CompanyFolder'))
const Template = React.lazy(()=> import('./components/Template/Template'))
const Home = React.lazy(()=> import('./components/Home/Home'))
const Sustainability = React.lazy(()=> import('./components/Sustainability/Sustainability'))
const OurServices = React.lazy(()=> import('./components/OurServices/OurServices'))
const CardsDetails = React.lazy(()=> import('./components/Products/CardsDetails/CardsDetails'))
const UpdateProduct = React.lazy(()=> import('./components/ProductManagement/CreateProduct/UpdateProduct/UpdateProduct'))



function App() {

  let query = new QueryClient()


  let route = createBrowserRouter([
      {path : '' , element : <Layout/> , children : [
      {index : true , element : <Home/>},
      {path : 'Sustainability' , element : <Sustainability/>},
      {path : 'OurServices' , element : <OurServices/>},
      {path : 'OurProducts' , element : <OurProducts/>},
      {path : 'Quotation' , element : <ProductRoute> <Quotation/> </ProductRoute>},
      {path : 'Template' , element : <ProductRoute> <Template/> </ProductRoute>},
      {path : 'Customers' , element : <ProductRoute> <Customers/> </ProductRoute>},
      {path : 'Categories' , element : <ProductRoute> <Categories/> </ProductRoute>},        
      {path : 'Catalogs' , element : <ProductRoute> <Catalogs/> </ProductRoute>},
      {path : 'Baskets' , element : <ProductRoute> <Baskets/> </ProductRoute>},
      {path : 'Members' , element : <ProductRoute> <Members/> </ProductRoute>},
      {path : 'Products' , element : <ProductRoute> <Products/> </ProductRoute> },
      {path : 'ProductManagement' , element : <ProductRoute> <ProductManagement/> </ProductRoute>},
      {path : 'ToDoList' , element : <ProductRoute> <ToDoList/> </ProductRoute>},
      {path : 'ProductDetails/:id' , element : <ProductRoute> <ProductDetails/> </ProductRoute>},
      {path : 'Brands' , element : <ProductRoute> <Brands/> </ProductRoute>},
      {path : 'Waste' , element : <ProductRoute>  <Waste/> </ProductRoute>},
      {path : 'Login' , element :  <Login/>},
      {path : 'Register' , element : <Register/>},
      {path : 'Main' , element : <ProductRoute> <Main/> </ProductRoute>},
      {path : 'CreateProduct/:id' , element : <ProductRoute> <CreateProduct/> </ProductRoute>},
      {path : 'CreateProduct' , element : <ProductRoute> <CreateProduct/> </ProductRoute>},
      {path : 'MainCategory/:brandId' , element : <ProductRoute> <MainCategory/> </ProductRoute>},
      {path : 'SubCategory/:SubID' , element : <ProductRoute> <SubCategory/> </ProductRoute>},
      {path : 'AllMainCategory/:brandsId' , element :  <AllMainCategory/>},
      {path : 'AllSubCategory/:SubID' , element :  <AllSubCategory/>},
      {path : 'Cart' , element : <Cart/>},
      {path : 'SubProductDetails/:id' , element : <SubProductsDetails/>},
      {path : 'ForgetPassword' , element : <ForgetPassword/>},
      {path : 'ResetPassword' , element : <ResetPassword/>},
      {path : 'VerifyEmail' , element : <VerfiyEmail/>},
      {path : 'BasketsProducts/:BasketsId' , element : <ProductRoute> <BasketsProducts/> </ProductRoute>},
      {path : 'CatalogsProducts/:CatalogsId' , element : <ProductRoute> <CatalogsProducts/> </ProductRoute>},
      {path : 'CompanyFolder/clientId' , element : <ProductRoute> <CompanyFolder/> </ProductRoute>},
      {path : 'Template' , element : <ProductRoute> <Template/> </ProductRoute>},
      {path : 'SubCategory/:SubsId/ProductDetails/:id' , element : <ProductDetails/>},
      {path: 'CardsDetails/:id' , element : <ProductRoute><CardsDetails/></ProductRoute>},
      {path: 'UpdateProduct/:id' , element : <ProductRoute><UpdateProduct/></ProductRoute>},
      {path : '*' , element : <NotFoundPage/>}
    ]}
  ])
  useEffect(() => {
  const cur = localStorage.getItem('lang') || 'ar';
  document.documentElement.dir = cur === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = cur;
}, []);



  return ( 
  <>
    <CartProvider>
      <QueryClientProvider client={query}>
        <NotificationProvider>
        <RouterProvider router={route}>
        </RouterProvider>
        <Toaster  position="bottom-right"
         reverseOrder={false}/>
        </NotificationProvider>
      </QueryClientProvider>
    </CartProvider>
  </>
  )
}
export default App