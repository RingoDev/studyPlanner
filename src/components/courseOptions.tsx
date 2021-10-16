import {alpha, Button, ListItemIcon, Menu, MenuItem, MenuProps, styled} from "@material-ui/core";
import React, {useRef, useState} from "react";
import Course from "../types/types";
import {MoreVertical, Check, X} from "lucide-react";
import {useAppDispatch} from "../redux/hooks";
import {setCourseFinished, setCourseUnfinished} from "../redux/data/data.actions";


const CourseOptions = ({course}: { course: Course }) => {


    const dispatch = useAppDispatch()

    const ref = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState<boolean>(false)
    const handleClick = () => {
        setOpen(!open);
    };

    const StyledMenu = styled<(props: MenuProps) => JSX.Element>((props) => (
        <Menu
            elevation={0}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            {...props}
        />
    ))(({theme}) => ({
        '& .MuiPaper-root': {
            borderRadius: 6,
            marginTop: '36px',
            minWidth: 160,
            color: 'rgb(55, 65, 81)',
            boxShadow:
                'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
            '& .MuiMenu-list': {
                padding: '4px 0',
            },
            '& .MuiMenuItem-root': {
                display: "flex",
                justifyContent: "space-between",
                '&:active': {
                    backgroundColor: alpha(
                        theme.palette.primary.main,
                        theme.palette.action.selectedOpacity,
                    ),
                },
            },
        },
    }));


    const handleFinish = (finish: boolean) => {
        if (finish) {
            dispatch(setCourseFinished({courseId: course.id}))
        } else {
            dispatch(setCourseUnfinished({courseId: course.id}))
        }

        setOpen(false)
    }

    return (
        <ListItemIcon>
            <Button ref={ref} onClick={handleClick}> <MoreVertical/></Button>
            <StyledMenu
                anchorEl={ref.current}
                open={open}
                onClose={() => setOpen(false)}
            >
                {
                    course.finished ? <MenuItem disableRipple onClick={() => handleFinish(false)}>
                            Abschließen
                            <X/>
                        </MenuItem>
                        : <MenuItem disableRipple onClick={() => handleFinish(true)}>
                            Abschließen
                            <Check/>
                        </MenuItem>
                }

                <MenuItem disableRipple onClick={() => setOpen(false)}>
                    Anrechnen
                    <Check/>
                </MenuItem>
            </StyledMenu>
        </ListItemIcon>
    )
}

export default CourseOptions