import "./style.css";
import { Room, RoomEvent } from "livekit-client";

document.querySelector("#app").innerHTML = `
<div class="container">

    <h1>LiveKit Audio Demo</h1>

    <input
        id="room"
        placeholder="Room Name"
        value="demo-room"
    />

    <input
        id="identity"
        placeholder="Your Name"
    />

    <button id="join">
        Join Call
    </button>

    <p id="status">
        Disconnected
    </p>

</div>
`;

const joinBtn = document.getElementById("join");

joinBtn.onclick = async () => {

    const roomName = document.getElementById("room").value;

    const identity = document.getElementById("identity").value;

    const response = await fetch("http://localhost:8080/join", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            room: roomName,

            identity: identity

        })

    });

    const data = await response.json();

    console.log(data);

    const room = new Room();

    room.on(RoomEvent.ParticipantConnected, participant => {

        console.log("Participant Joined:", participant.identity);

    });

    room.on(RoomEvent.TrackSubscribed,

        (track) => {

            console.log("Track subscribed", track.kind);

            if (track.kind === "audio") {

                track.attach();

            }

        }

    );

    await room.connect(data.url, data.token);

    await room.localParticipant.setMicrophoneEnabled(true);

    document.getElementById("status").innerHTML =
        "Connected";
};