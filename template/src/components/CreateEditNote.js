import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "CreateEditNote",
  model: {
    prop: "note",
    event: "change"
  },
  props: {
    note: {
      type: Object,
      default: () => {
        return { title: "", text: "" };
      }
    },
    mode: {
      type: String,
      default: "",
      required: true
    }
  },
  data() {
    return {};
  },
  computed: {
    localNote() {
      return JSON.parse(JSON.stringify(this.note));
    },
    ...mapGetters(["nextId"]),
    ...mapState(["labels"])
  },
  methods: {
    ...mapActions(["addNote", "editNote"]),
    preventPropagation(event) {
      event.stopPropagation();
    },
    closeModal(event) {
      if (
        (this.localNote.title || this.localNote.text) &&
        this.mode === "create"
      ) {
        this.addNote(this.localNote);
      } else if (this.mode === "edit") {
        this.editNote(this.localNote);
      }
      event.stopPropagation();
      this.$emit("closeModal");
    },
    onSubmit(event) {
      event.preventDefault();
    }
  },
  render() {
    return (
      <div
        class="modal bg-see-through"
        style="display:block;"
        onClick={this.closeModal}
      >
        <div
          onClick={this.preventPropagation}
          class="rounded text-center modal-dialog bg-white"
        >
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{this.mode} note</h5>
              <button
                class="btn btn-danger"
                onClick={this.closeModal}
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form onSubmit={this.onSubmit}>
                <div class="form-group">
                  <label for="title">title</label>
                  {this.$scopedSlots.title ? (
                    this.$scopedSlots.title(this.localNote)
                  ) : (
                    <input
                      value={this.localNote.title}
                      name="title"
                      id="title"
                      onInput={event => {
                        this.localNote.title = event.currentTarget.value;
                      }}
                    ></input>
                  )}
                </div>
                <div class="form-group">
                  <label for="note-text">text</label>
                  <textarea
                    value={this.localNote.text}
                    onInput={event => {
                      this.localNote.text = event.currentTarget.value;
                    }}
                  ></textarea>
                </div>
                <div class="form-group">
                  <label for="note-text">labels</label>
                  <select
                    value={this.localNote.label}
                    onChange={event =>
                      (this.localNote.label = event.currentTarget.value)
                    }
                  >
                    {this.labels.map(label => {
                      return <option value={label}>{label}</option>;
                    })}
                  </select>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
