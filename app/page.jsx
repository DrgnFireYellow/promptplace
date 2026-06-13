import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import connectDB from "@/lib/connectDB";
import Prompt from "@/models/Prompt";

export default async function MainPage({ searchParams }) {
  await connectDB();
  const prompts = await Prompt.find();

  const params = await searchParams;

  async function createPrompt() {
    "use server";
    const newPrompt = await Prompt.create({ name: "Untitled Prompt" });
    redirect(`/?promptID=${newPrompt._id.toString()}`);
  }

  if (prompts.length === 0) {
    await createPrompt();
    revalidatePath("/");
  }

  const activePrompt = params.promptID
    ? await Prompt.findOne({ _id: params.promptID })
    : prompts[0];

  async function savePrompt(formData) {
    "use server";

    const name = formData.get("name");
    const template = formData.get("template");

    if (name) {
      await Prompt.findByIdAndUpdate(formData.get("promptID"), {
        name: name,
        template: template,
      });
      revalidatePath("/");
    }
  }


  async function deletePrompt(formData) {
    "use server";
    await Prompt.findByIdAndDelete(formData.get("promptID"));
    redirect("/");
  }

  // Get the list of fragments for the active prompt
  const fragmentKeys = [
    ...new Set(
      (activePrompt?.template?.match(/\{\{.*?\}\}/g) || []).map((fragment) =>
        fragment.replace(/[\{\}]/g, "").trim(),
      ),
    ),
  ];

  const compiledPrompt = fragmentKeys.reduce((text, fragment) => {
    return text.replaceAll(
      `{{${fragment}}}`,
      params[`fragment.${fragment}`] || `{{${fragment}}}`,
    );
  }, activePrompt?.template || "");

  return (
    <div>
      <div className="sidebar">
        <h1>📝 Promptplace</h1>
        <h2>Prompts</h2>
        <form action={createPrompt}>
          <button type="submit">+ New Prompt</button>
        </form>
        <ul className="prompts">
          {prompts.map((prompt) => (
            <li key={prompt._id.toString()}>
              <Link href={`/?promptID=${prompt._id.toString()}`}>
                📝 {prompt.name}
              </Link>
            </li>
          ))}
        </ul>
        {/* <h2>Fragment Lists</h2>
        <ul className="fragmentLists"></ul> */}
      </div>
      <div className="editor">
        <div id="fragmentEditor">
          <form action="/" method="GET">
            <input
              type="hidden"
              name="promptID"
              value={activePrompt?._id.toString()}
            />
            {fragmentKeys.map((fragment) => (
              <label key={fragment}>
                {fragment}:{" "}
                <input
                  type="text"
                  defaultValue={params[`fragment.${fragment}`] || ""}
                  name={`fragment.${fragment}`}
                />
              </label>
            ))}
            <button type="submit">Compile Prompt</button>
          </form>
          <p id="compiledPrompt">{compiledPrompt}</p>
        </div>
        <div id="templateEditor">
          <input
            type="text"
            name="name"
            defaultValue={activePrompt?.name}
            key={`name_${activePrompt?._id.toString()}`}
            required
            form="updateTemplate"
          />
          <textarea
            name="template"
            defaultValue={activePrompt?.template}
            key={activePrompt?._id.toString() || "empty"}
            form="updateTemplate"
          ></textarea>
          <div className="buttonRow">
            <form action={savePrompt} id="updateTemplate">
              <input
                type="hidden"
                name="promptID"
                value={activePrompt?._id.toString()}
              />
              <button type="submit">Save</button>
            </form>
            <form id="deletePrompt" action={deletePrompt}>
              <input
                type="hidden"
                name="promptID"
                value={activePrompt?._id.toString()}
              />
              <button type="submit">Delete Prompt</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
