
type ArtPropertyComponentProps = {
    label: string;
    value?: string;
}


const ArtPropertyComponent = ({label, value}: ArtPropertyComponentProps) => {
    if(!value) return <></>

    return <div className="flex flex-col gap-2">
        <h6 className="text-h2_light">{label}</h6>
        <p className="text-h2_bold">{value}</p>
    </div>
}

export default ArtPropertyComponent;