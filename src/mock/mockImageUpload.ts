import mockUrl from '../assets/mock.png'
import MockAdapter from 'axios-mock-adapter'

export default function doImageUploadMock(mock: MockAdapter){
    mock.onPost("/file").reply(200, {url: mockUrl})
}