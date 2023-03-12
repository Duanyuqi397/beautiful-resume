import mockFileUpload from './mockImageUpload'
import {mockRegister} from './mockLogin'
import MockAdapter from 'axios-mock-adapter'

export default function doMock(mock: MockAdapter){
    mockFileUpload(mock)
    mockRegister(mock)
}