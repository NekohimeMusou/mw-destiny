# Code Examples

```hbs
<div class="bio-subsection description-area">
    <div class="bio-section-label">
        {{localize "CityOfMist.terms.description"}}
    </div>
    <div class="editor-box">
        {{editor description target="system.description" button=true owner=owner editable=true engine="prosemirror" collaborate=false}}
    </div>
</div>
```

```css
div.bio-subsection {
    overflow: hidden;
    /* border-top: 4px; */
    /* border-top-color: black; */
    /* border-top-style: solid; */
    margin-top: 5px;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: stretch;
}
```
