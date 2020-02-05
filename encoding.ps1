$script:dash = "$([char]0x2015)"

function EncodingInfo {
  echo "`n[Console]::InputEncoding   WebName: $([Console]::InputEncoding.WebName.PadRight(12)) CodePage: $([Console]::InputEncoding.CodePage)"
  echo "[Console]::OutputEncoding  WebName: $([Console]::OutputEncoding.WebName.PadRight(12)) CodePage: $([Console]::OutputEncoding.CodePage)"
  echo "`n$($dash * 4) Ruby Encodings $($dash * 4)"
  iex "ruby.exe -e `"['external','filesystem','internal','locale'].each { |e| puts e.ljust(12) + Encoding.find(e).to_s }`""
}

EncodingInfo

if ([Console]::OutputEncoding.CodePage -ne '437') {
  [Console]::OutputEncoding = [System.Text.Encoding]::GetEncoding('IBM437')
  [Console]::InputEncoding  = [System.Text.Encoding]::GetEncoding('IBM437')
  echo "`nSetting [Console] encodings to 'IBM437'"
  EncodingInfo
}
