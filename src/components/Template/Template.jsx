import React from 'react'
const Dashboard = React.lazy(()=> import('../Dashboard/Dashboard'))
const DataTableTemplate = React.lazy(()=> import('./DataTableTemplate/DataTableTemplate'))  
const TemplateNavbar = React.lazy(()=> import('./TemplateNavbar/TemplateNavbar'))




export default function Template() {
  return <section>
        <div className='grid grid-cols-[270px_1fr] me-4'>

                        {/*Slilde bar */}
                        <div className='mb-14 me-8'>
                            <Dashboard/>
                        </div>

                        {/*Navbar */}
                        <div>
                          <TemplateNavbar/>

                        {/* Content */}
                        <div className='mt-52'>
                          <DataTableTemplate/>
                        </div>
                            

                        </div>
                   </div> 
    </section>
}

