import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

import styles from "../styles/Home.module.css";

export default function Home({ pokemon }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Pokemon Guide!</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Pokemon Guide</h1>

        <p className={styles.description}>A list of the original Pokemon!</p>

        <div className={styles.grid}>
          {pokemon.map((p) => {
            return (
              <Link key={p.id} href={`/pokemon/${encodeURIComponent(p.name)}`}>
                <a href="https://nextjs.org/learn" className={styles.card}>
                  <Image
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
                    alt={p.name}
                    width={100}
                    height={100}
                  />
                  <h2>{p.name}</h2>
                </a>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: "https://beta.pokeapi.co/graphql/v1beta",
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({
    query: gql`
      query samplePokeAPIquery {
        gen3_species: pokemon_v2_pokemonspecies(
          order_by: { id: asc }
          where: { pokemon_v2_generation: { name: { _eq: "generation-i" } } }
        ) {
          name
          id
        }
      }
    `,
  });

  return {
    props: {
      pokemon: data.gen3_species,
    },
  };
}
