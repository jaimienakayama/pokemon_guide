import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";

const Pokemon = ({ pokemon }) => {
  return (
    <>
      <Image
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
        width={500}
        height={500}
        alt={pokemon.name}
      ></Image>
      <h1>{pokemon.name}</h1>
      <p>
        {
          pokemon.pokemon_v2_pokemonspeciesflavortexts[
            Math.floor(Math.random() * 5)
          ].flavor_text
        }
      </p>
      <u>General Info:</u>
      <ul>
        <li>
          <strong>Pokemon No:</strong> {pokemon.id}
        </li>
        <li>
          <strong>Type(s):</strong>
          <ul>
            {pokemon.pokemon_v2_pokemons[0].pokemon_v2_pokemontypes.map((p) => {
              return (
                <li key={p.pokemon_v2_type.name}>{p.pokemon_v2_type.name}</li>
              );
            })}
          </ul>
        </li>
        <li>
          <strong>Habitat:</strong> {pokemon.pokemon_v2_pokemonhabitat.name}
        </li>
        <li>
          <strong>Base experience:</strong>{" "}
          {pokemon.pokemon_v2_pokemons[0].base_experience} hp
        </li>
        <li>
          <strong>Weight:</strong>{" "}
          {Math.ceil((pokemon.pokemon_v2_pokemons[0].weight / 10) * 2.2)} lbs
        </li>
        <li>
          <strong>Height:</strong>{" "}
          {((pokemon.pokemon_v2_pokemons[0].height / 10) * 3.281).toFixed(1)}{" "}
          feet
        </li>
      </ul>
      <u>Moves:</u>
      <ul>
        {pokemon.pokemon_v2_pokemons[0].pokemon_v2_pokemonmoves.map((p) => {
          return (
            <li key={p.pokemon_v2_move.name}>
              <strong>{p.pokemon_v2_move.name}</strong>: power{" "}
              {p.pokemon_v2_move.power} - pp {p.pokemon_v2_move.pp} - type{" "}
              {p.pokemon_v2_move.pokemon_v2_type.name}{" "}
            </li>
          );
        })}
      </ul>
      <u>Evolution Chain:</u>
      <ol>
        {pokemon.pokemon_v2_evolutionchain.pokemon_v2_pokemonspecies.map(
          (p) => {
            return <li key={p.name}>{p.name}</li>;
          }
        )}
      </ol>
      <Link href="/" passHref>
        <button>Back</button>
      </Link>
    </>
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
        gen3_species: pokemon_v2_pokemonspecies(
          where: {
            pokemon_v2_generation: { name: { _eq: "generation-i" } }
            name: { _eq: ${params.pokemonId} }
          }
        ) {
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
            pokemon_v2_pokemonmoves(
              distinct_on: move_id
              order_by: { move_id: asc }
              where: {
                _and: { pokemon_v2_move: { generation_id: { _eq: 1 } } }
              }
            ) {
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
            pokemon_v2_pokemonspecies(where: {generation_id: {_eq: 1}}) {
              name
            }
          }
          pokemon_v2_pokemonspeciesflavortexts(
            where: { pokemon_v2_language: { name: { _eq: "en" } } }
            order_by: { id: desc }
            limit: 5
            offset: 2
          ) {
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
          order_by: {}
          where: { pokemon_v2_generation: { name: { _eq: "generation-i" } } }
        ) {
          name
        }
      }
    `,
  });

  return {
    paths: data.gen3_species.map((d) => {
      return {
        params: {
          pokemonId: d.name,
        },
      };
    }),
    fallback: false,
  };
};

export default Pokemon;
