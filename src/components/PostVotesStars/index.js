import "./style.css";
import StarIcon from "../StarIcon";
import { useTokenContext } from "../../context/TokenContext";

const PostVotesStars = ({ rate, idPost, addVoteToPost }) => {
  const { token } = useTokenContext();

  // En este array meteremos las estrellitas que vamos a generar
  const stars = [];

  // startsToFill es el número de estrellas que queremos pintar. Si la votación de la entrada es 2.6 pintaremos 3 estrellas, si es 2.4 pintaremos 2
  const starsToFill = Math.round(rate);

  // Hacemos un bucle que da 5 vueltas. En cada vuelta genera una estrella y la mete en el array de stars. Si la vuelta actual (1, 2, 3, 4 o 5) es menor o igual que las estrellas que queremos pintar, pintamos la estrella de negro, si no no
  for (let currentStar = 1; currentStar <= 5; currentStar++) {
    stars.push(
      <li
        key={currentStar}
        onClick={async (e) => {
          try {
            if (!addVoteToPost) {
              return;
            }

            e.preventDefault();

            const res = await fetch(
              `http://localhost:4000/posts/${idPost}/votes`,
              {
                method: "POST",
                headers: {
                  Authorization: token,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ value: currentStar }),
              }
            );

            const body = await res.json();
            console.log("body.data6", body);

            if (!res.ok) {
              throw new Error(body.message);
            }

            addVoteToPost({
              id: idPost,
              newAvg: body.data.value,
              ratedByMe: currentStar,
            });
          } catch (error) {
            console.error(error);
          }
        }}
      >
        <StarIcon fill={currentStar <= starsToFill ? "black" : "white"} />
      </li>
    );
  }

  // Pintamos una ul con todos los li con las estrellas
  return <ul className="entryVotesStars">{stars}</ul>;
};

export default PostVotesStars;
