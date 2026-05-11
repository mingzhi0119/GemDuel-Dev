# Third-party Fonts

Unity Local PVP uses TextMeshPro SDF font assets generated from the source fonts in `SourceFonts/`.

| Font                  | Runtime use                                                     | Source                                                                       | License                   |
| --------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------- |
| Noto Sans SC          | Default Unity UI font during Electron parity work               | https://github.com/google/fonts/tree/main/ofl/notosanssc                     | SIL Open Font License 1.1 |
| Noto Serif SC         | Candidate accent/title font                                     | https://github.com/google/fonts/tree/main/ofl/notoserifsc                    | SIL Open Font License 1.1 |
| ZCOOL QingKe HuangYou | Candidate display font                                          | https://github.com/google/fonts/tree/main/ofl/zcoolqingkehuangyou            | SIL Open Font License 1.1 |
| Noto Sans Symbols     | TMP fallback for controls, dropdowns, and battle/status symbols | https://github.com/notofonts/noto-fonts/tree/main/hinted/ttf/NotoSansSymbols | SIL Open Font License 1.1 |
| Noto Sans Symbols 2   | TMP fallback for icon-like symbols and emoji-style UI marks     | https://github.com/google/fonts/tree/main/ofl/notosanssymbols2               | SIL Open Font License 1.1 |
| Noto Sans Math        | TMP fallback for rotate/refresh arrow glyph coverage            | https://github.com/notofonts/math/releases/tag/NotoSansMath-v3.000           | SIL Open Font License 1.1 |

Generated TextMeshPro assets and material presets live under `Resources/GemDuelFonts/` so the Unity parity renderer can load them without depending on editor-only APIs.
