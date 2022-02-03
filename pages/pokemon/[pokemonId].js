import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/Pokemon.module.css";
import {
  faBolt,
  faLeaf,
  faFireAlt,
  faTint,
  faBug,
  faSkullCrossbones,
  faFeather,
  faGlobeAmericas,
  faMagic,
  faHandRock,
  faStarAndCrescent,
  faGhost,
  faStarOfLife,
  faWrench,
  faSnowflake,
  faDragon,
  faMeteor,
  faAngleDoubleRight,
  faAngleDoubleLeft,
  faMoon,
  faStar,
  faHandPointRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Pokemon = ({ pokemon }) => {
  const typeIcon = {
    normal: faStarOfLife,
    grass: faLeaf,
    water: faTint,
    fire: faFireAlt,
    bug: faBug,
    poison: faSkullCrossbones,
    flying: faFeather,
    ground: faGlobeAmericas,
    fairy: faMagic,
    fighting: faHandRock,
    psychic: faStarAndCrescent,
    ghost: faGhost,
    steel: faWrench,
    ice: faSnowflake,
    dragon: faDragon,
    rock: faMeteor,
    electric: faBolt,
    dark: faMoon,
  };

  return (
    <div>
      <Link href="/" passHref>
        <button className={styles.backButton}>BACK</button>
      </Link>
      <div className={styles.container}>
        <div className={styles.upperContent}>
          <Image
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
            width={500}
            height={500}
            alt={pokemon.name}
          ></Image>
          <h1>{pokemon.name}</h1>
          <p>
            <em>
              {`"${
                pokemon.pokemon_v2_pokemonspeciesflavortexts[
                  Math.floor(Math.random() * 5)
                ].flavor_text
              }"`}
            </em>
          </p>
        </div>

        <div className={styles.lowerContent}>
          <div className={styles.column}>
            <div className={styles.columnTitle}>SPECIES INFO</div>
            <div>
              <strong>Name:</strong> {pokemon.name}
            </div>
            <div>
              <strong>Pokemon No:</strong> {pokemon.id}
            </div>
            <strong>Type(s):</strong>
            <ul>
              {pokemon.pokemon_v2_pokemons[0].pokemon_v2_pokemontypes.map(
                (p) => {
                  return (
                    <li key={p.pokemon_v2_type.name}>
                      <FontAwesomeIcon
                        icon={typeIcon[p.pokemon_v2_type.name]}
                      />{" "}
                      {p.pokemon_v2_type.name}{" "}
                    </li>
                  );
                }
              )}
            </ul>
            <div>
              <strong>Habitat:</strong> {pokemon.pokemon_v2_pokemonhabitat.name}
            </div>
            <div>
              <strong>Base experience:</strong>{" "}
              {pokemon.pokemon_v2_pokemons[0].base_experience} hp
            </div>
            <div>
              <strong>Weight:</strong>{" "}
              {Math.ceil((pokemon.pokemon_v2_pokemons[0].weight / 10) * 2.2)}{" "}
              lbs
            </div>
            <div>
              <strong>Height:</strong>{" "}
              {((pokemon.pokemon_v2_pokemons[0].height / 10) * 3.281).toFixed(
                1
              )}{" "}
              feet
            </div>
          </div>

          <div className={styles.column}>
            <div className={styles.columnTitle}>POKEMON MOVES</div>
            {pokemon.pokemon_v2_pokemons[0].pokemon_v2_pokemonmoves.map((p) => {
              return (
                <div className={styles.move} key={p.pokemon_v2_move.name}>
                  <strong>
                    <em>{p.pokemon_v2_move.name}</em>
                  </strong>{" "}
                  <FontAwesomeIcon icon={faHandPointRight} /> power{" "}
                  <strong>
                    {p.pokemon_v2_move.power ? p.pokemon_v2_move.power : 0}
                  </strong>{" "}
                  - pp <strong>{p.pokemon_v2_move.pp}</strong> - type{" "}
                  <strong>{p.pokemon_v2_move.pokemon_v2_type.name}</strong>{" "}
                  <FontAwesomeIcon
                    icon={typeIcon[p.pokemon_v2_move.pokemon_v2_type.name]}
                  />
                </div>
              );
            })}
          </div>

          <div className={styles.column}>
            <div className={styles.columnTitle}>EVOLUTION</div>
            <div>
              {pokemon.pokemon_v2_evolutionchain.pokemon_v2_pokemonspecies.map(
                (p) => {
                  return (
                    <>
                      {p.id !== pokemon.id ? (
                        <Link
                          key={p.id}
                          href={`/pokemon/${encodeURIComponent(p.id)}`}
                          passHref
                        >
                          <div key={p.name}>
                            <span className={styles.evoLink}>
                              <strong>{p.name}</strong>
                            </span>{" "}
                          </div>
                        </Link>
                      ) : (
                        <div className={styles.evoLinkDisabled}>
                          <strong>{p.name}</strong>
                        </div>
                      )}
                    </>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps = async ({ params }) => {
  const client = new ApolloClient({
    uri: "https://beta.pokeapi.co/graphql/v1beta",
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({
    query: gql`
    query samplePokeAPIquery {
      gen3_species: pokemon_v2_pokemonspecies(where: {pokemon_v2_generation: {name: {_eq: "generation-i"}}, id: {_eq: ${params.pokemonId}}}) {
        name
        id
        pokemon_v2_pokemonhabitat {
          name
        }
        pokemon_v2_pokemons(limit: 1) {
          height
          base_experience
          weight
          pokemon_v2_pokemontypes {
            pokemon_v2_type {
              name
            }
          }
          pokemon_v2_pokemonmoves(distinct_on: move_id, order_by: {move_id: asc}, where: {_and: {pokemon_v2_move: {generation_id: {_eq: 1}}}}) {
            pokemon_v2_move {
              name
              power
              pp
              pokemon_v2_type {
                name
              }
            }
          }
        }
        pokemon_v2_evolutionchain {
          pokemon_v2_pokemonspecies(where: {generation_id: {_eq: 1}}, order_by: {id: asc}) {
            name
            id
          }
        }
        pokemon_v2_pokemonspeciesflavortexts(where: {pokemon_v2_language: {name: {_eq: "en"}}}, order_by: {id: desc}, limit: 5, offset: 2) {
          flavor_text
        }
      }
    }

    `,
  });

  return {
    props: {
      pokemon: data.gen3_species[0],
    },
  };
};

export const getStaticPaths = async () => {
  const client = new ApolloClient({
    uri: "https://beta.pokeapi.co/graphql/v1beta",
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({
    query: gql`
      query samplePokeAPIquery {
        gen3_species: pokemon_v2_pokemonspecies(
          where: { pokemon_v2_generation: { name: { _eq: "generation-i" } } }
          order_by: { id: asc }
        ) {
          id
        }
      }
    `,
  });

  return {
    paths: data.gen3_species.map((d) => {
      return {
        params: {
          pokemonId: d.id.toString(),
        },
      };
    }),
    fallback: false,
  };
};

export default Pokemon;
