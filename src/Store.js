import { configureStore } from '@reduxjs/toolkit'
import authSlice from './reducer/Authslice'

const store=configureStore({

    reducer:{
        auth:authSlice
    }
})


export default store