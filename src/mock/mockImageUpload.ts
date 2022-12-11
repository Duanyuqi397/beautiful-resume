import mock from './adapter'
import mockUrl from '../assets/mock.png'

export default function doImageUploadMock(){
    mock.onPost("/file", {url: mockUrl})
}