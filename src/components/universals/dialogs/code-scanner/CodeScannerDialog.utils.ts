function getUserMediaStream(): Promise<MediaStream> {
  return new Promise<MediaStream>((resolve, reject) => {
    navigator.getUserMedia({
      video: true,
      audio: false
    }, (stream) => {
      resolve(stream);
    }, (error) => {
      // An error occurred
      reject(error);
    });
  });
}

export async function getVideoStream({ abortSignal }: { abortSignal: AbortSignal }): Promise<{ video: HTMLVideoElement }> {
  const video = document.createElement('video');
  const stream = await getUserMediaStream();

  video.srcObject = stream;
  await video.play();

  function abort() {
    video.pause();
    video.srcObject = null;

    stream.getTracks().forEach((track) => {
      track.stop();
    });
  }

  abortSignal.addEventListener('abort', () => {
    abort();
  });

  if (abortSignal.aborted) {
    abort();
  }

  return {
    video,
  }
}

export const codeScannerDialogUtils = {
  getVideoStream,
};
