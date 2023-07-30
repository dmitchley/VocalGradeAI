# import os
# import pyaudio
# import wave

# filename = "recorded.wav"
# chunk = 1024
# FORMAT = pyaudio.paInt16
# channels = 1
# sample_rate = 44100
# stop_filename = "stop.txt"

# p = pyaudio.PyAudio()
# stream = p.open(format=FORMAT,
#                 channels=channels,
#                 rate=sample_rate,
#                 input=True,
#                 output=True,
#                 frames_per_buffer=chunk)

# frames = []

# print("Recording...")
# while True:
#     data = stream.read(chunk)
#     frames.append(data)
#     if os.path.exists(stop_filename):
#         print("Stop file detected. Stopping...")
#         break

# print("Finished recording.")
# stream.stop_stream()
# stream.close()
# p.terminate()

# wf = wave.open(filename, "wb")
# wf.setnchannels(channels)
# wf.setsampwidth(p.get_sample_size(FORMAT))
# wf.setframerate(sample_rate)
# wf.writeframes(b"".join(frames))
# wf.close()


import os
import pyaudio
import wave
import assemblyai

filename = "recorded.wav"
chunk = 1024
FORMAT = pyaudio.paInt16
channels = 1
sample_rate = 44100
stop_filename = "stop.txt"

assemblyai.api_key = 'e1feba3ea0cd4255b423b8d60818367b'
file_transcript = 'transcript.txt'

p = pyaudio.PyAudio()
stream = p.open(format=FORMAT,
                channels=channels,
                rate=sample_rate,
                input=True,
                output=True,
                frames_per_buffer=chunk)

frames = []

print("Recording...")
while True:
    data = stream.read(chunk)
    frames.append(data)
    if os.path.exists(stop_filename):
        print("Stop file detected. Stopping...")
        break

print("Finished recording.")
stream.stop_stream()
stream.close()
p.terminate()

wf = wave.open(filename, "wb")
wf.setnchannels(channels)
wf.setsampwidth(p.get_sample_size(FORMAT))
wf.setframerate(sample_rate)
wf.writeframes(b"".join(frames))
wf.close()

def transcribe_file(file_path):
    transcript = assemblyai.Transcript.create(file_path=file_path)
    while transcript.status != 'completed':
        transcript = assemblyai.Transcript(transcript.id)
    return transcript.text

transcription = transcribe_file(filename)

# Save the transcription to a file
with open(file_transcript, 'w') as f:
    f.write(transcription)
