import { ComponentWithSyncTime, SyncClient } from '../types'
import client from './client'

class SimpleSyncClient implements SyncClient{
    put(resumeId: string,  components: ComponentWithSyncTime[]): Promise<any> {
        return client.put('/components', {resumeId, components})
    }
    remove(resumeId: string, componentsIds: string[]): Promise<any> {
        const data = {
            resumeId,
            componentsIds
        }
        return client.delete('/components', {data})
    }
}

export default SimpleSyncClient