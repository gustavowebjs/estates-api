import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob'
import { readFileSync } from 'node:fs'

export default class UploadService {
  private accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME
  private accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY
  private containerName = process.env.AZURE_STORAGE_CONTAINER_NAME

  private blobServiceClient: BlobServiceClient

  constructor() {
    const sharedKeyCredential = new StorageSharedKeyCredential(
      this.accountName || '',
      this.accountKey || ''
    )
    this.blobServiceClient = new BlobServiceClient(
      `https://${this.accountName}.blob.core.windows.net`,
      sharedKeyCredential
    )
  }

  async uploadFile(filePath: string, blobName: string): Promise<string> {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName ?? '')
      const blockBlobClient = containerClient.getBlockBlobClient(blobName)

      const data = readFileSync(filePath)
      const uploadBlobResponse = await blockBlobClient.upload(data, data.length)

      console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId)

      return blockBlobClient.url
    } catch (error) {
      console.error('Error uploading file to Azure Blob Storage:', error)
      throw new Error('File upload failed')
    }
  }

  async listFiles(): Promise<string[]> {
    const containerClient = this.blobServiceClient.getContainerClient(this.containerName ?? '')
    const blobs = []

    for await (const blob of containerClient.listBlobsFlat()) {
      blobs.push(blob.name)
    }

    return blobs
  }

  async deleteFile(blobName: string): Promise<void> {
    const containerClient = this.blobServiceClient.getContainerClient(this.containerName ?? '')
    const blockBlobClient = containerClient.getBlockBlobClient(blobName)

    await blockBlobClient.delete()
  }

  async downloadFile(blobName: string): Promise<Buffer> {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName ?? '')
      const blockBlobClient = containerClient.getBlockBlobClient(blobName)

      const downloadBlockBlobResponse = await blockBlobClient.download(0)
      const downloaded = await this.streamToBuffer(downloadBlockBlobResponse.readableStreamBody)
      console.log(`Downloaded block blob ${blobName} successfully`)

      return downloaded
    } catch (error) {
      console.error('Error downloading file from Azure Blob Storage:', error)
      throw new Error('File download failed')
    }
  }

  private async streamToBuffer(readableStream: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks = [] as any
      readableStream.on('data', (data: any) => {
        chunks.push(data instanceof Buffer ? data : Buffer.from(data))
      })
      readableStream.on('end', () => {
        resolve(Buffer.concat(chunks))
      })
      readableStream.on('error', reject)
    })
  }
}
