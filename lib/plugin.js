const plugin = {
  async appOption(app) {
    const exportOptions = await app.prompt("What do you want to export?", {
      inputs: [
        {
          label: "Export format",
          options: [ { label: "csv", value: "csv" } ],
          type: "select",
        },
        {
          label: "Tag path filter (optional)",
          type: "text"
        },
        // {
        //   label: "Note title filter (optional)",
        //   type: "text"
        // }
      ]
    });

    const [ exportFormat, tag ] = exportOptions;
    let filterOptions = {};
    if (tag?.length) filterOptions = { tag };

    const noteHandles = await app.notes.filter(filterOptions);
    const csv = [
      [ "name", "uuid", "body" ]
    ];


    for (let noteHandle of noteHandles) {
      const note = app.notes.find(noteHandle);
      const body = await note.content();

      const row = [
        noteHandle.name,
        noteHandle.uuid,
        body,
      ];

      csv.push(row)
    }

    const csvString = csv.map(row => row.join(",")).join("\n");
    const filename = `export-${ Date.now() }.csv`;
    const file = new Blob(csvString, { type: "text/csv" });
    await app.saveFile(file, filename);
  }
};
export default plugin;
