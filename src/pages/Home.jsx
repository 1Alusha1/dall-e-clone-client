import { useState, useEffect } from "react";

import { Loader, Card, FormField } from "../components/index";
import cfg from "../cfg";

const RenderCards = ({ data, title }) => {
  if (data?.length > 0)
    return data.map((post) => <Card key={post._id} {...post} />);

  return (
    <h2 className="mt-5 font-bold text-[#6449ff] text-xl-uppercase">{title}</h2>
  );
};

const Home = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);

  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);
  const [searchText, setSearchText] = useState(null);

  const getPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        cfg.apiLink + "/api/v1/post",
        {
          mode: "cors",
        }
      );
      const { data } = await res.json();
      console.log(data);
      setAllPosts(data);
    } catch (err) {
      if (err) console.log(err);
      alert(data.message);
    } finally {
      setLoading(false);
    }
  };

  const search = async (e) => {
    const query = e.target.value.toLowerCase();
    setQuery(query);

    const res = await fetch(
      cfg.apiLink + `/api/v1/post/search?query=${query}`,
      {
        mode: "cors",
      }
    );

    const { data } = await res.json();

    setResults(data);

    sort(query);
  };

  const sort = (condition) => {
    const filteredData = allPosts.sort((postA, postB) => {
      const postAPrompt = postA.prompt.toLowerCase();
      const postBPrompt = postB.prompt.toLowerCase();
      const conditionLower = condition.toLowerCase();

      const postAContains = postAPrompt.includes(conditionLower);
      const postBContains = postBPrompt.includes(conditionLower);

      if (postAContains && !postBContains) return -1;
      if (postBContains && !postAContains) return 1;
      return postAPrompt.localeCompare(postBPrompt);
    });

    setAllPosts([...filteredData]);
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <section className="m-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">
          The Community Showcase
        </h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">
          Browse through a collection of imaginative and visually stunning
          images generated by DALL-E AI
        </p>
      </div>
      <div className="mt-16 relative">
        <FormField
          type="text"
          name="search"
          placeholder="Enter your query"
          handleChange={search}
        />
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            {query && (
              <h2 className="font-medium text-[#666e75] text-xl mb-3">
                Showing result for{" "}
                <span className="text-[#222328]"> {query}</span>
              </h2>
            )}

            <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
              {query ? (
                <RenderCards data={allPosts} title="No search results found" />
              ) : (
                <RenderCards data={allPosts} title="No post found" />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Home;
