---
id: poblacion-y-muestra
titulo: Población y muestra
titulo_en: Population and sample
alias:
  - universo
  - censo
  - muestra estadística
modulo: 4
submodulo: '4.1'
orden: 1
nivel: basico
prerrequisitos:
  - conjuntos-y-notacion
relaciones:
  - tipo: relacionado
    id: parametro-y-estadistico
etiquetas:
  - población
  - muestra
  - censo
  - representatividad
  - muestreo
resumen: >
  La población es el conjunto completo de unidades sobre el que se quiere concluir; la muestra es la
  parte de esas unidades que realmente se observa y a partir de la cual se generaliza.
formula: 'S \subseteq U, \qquad n = |S| \le N = |U|'
visualizacion:
  componente: DataTypesViz
  parametros:
    modo: poblacion
    enfoque: muestra
    tamano: 240
    n: 15
    forma: normal
    centro: 7
    dispersion: 1.1
    decimales: 1
    estadistico: media
    unidad: estudiante
    variable: Horas de sueño
referencias:
  - clave: lohr
    capitulo: '1'
  - clave: degroot
publicado: true
---

## Intuición

Para saber si una olla de sopa está bien de sal no hace falta tomarse toda la sopa: basta revolverla y probar una cucharada. La olla completa es la **población**, la cucharada es la **muestra**, y el acto de revolver es lo que permite que una cucharada represente a toda la olla.

En estadística ocurre lo mismo. Casi nunca es posible, o conveniente, observar a todas las personas, piezas, días o parcelas que interesan. Se observa una parte y con ella se intenta decir algo del todo. La pregunta central es cuándo una parte pequeña habla con fidelidad del conjunto completo. La respuesta depende de cómo se elige: una cucharada tomada solo de la superficie, sin revolver, puede engañar aunque sea grande. Por eso importa tanto definir con precisión cuál es la población antes de medir, y elegir la muestra de modo que ninguna parte de esa población quede sistemáticamente fuera.

## Definición

:::definicion[Población y muestra]
La **población** $U$ es el conjunto de todas las unidades (personas, objetos, eventos) sobre las que se quiere obtener una conclusión. Su tamaño es $N = |U|$, que puede ser finito o conceptualmente infinito.

Una **muestra** es un subconjunto $S \subseteq U$ de unidades que efectivamente se observan. Su tamaño es $n = |S|$. Si $S = U$, la observación completa se llama **censo**.
:::

La **fracción de muestreo** es $f = n / N$. Una muestra es **aleatoria simple** cuando todos los subconjuntos de tamaño $n$ tienen la misma probabilidad de ser elegidos; esa es la forma más sencilla de evitar que la elección favorezca a un tipo de unidad.

La población debe definirse por completo antes de muestrear: qué unidades entran, en qué lugar y en qué periodo. "Los estudiantes" no es una población bien definida; "los estudiantes inscritos en la preparatoria en el semestre de otoño de 2024" sí lo es.

:::figura[Una población de 120 lotes de producción y una muestra de 10 lotes elegidos al azar. Cada círculo es un lote; los resaltados forman la muestra y la franja inferior compara el porcentaje medio de piezas defectuosas de la población con el de la muestra.]{componente="DataTypesViz"}
```yaml
modo: poblacion
enfoque: muestra
tamano: 120
n: 10
forma: sesgada
centro: 2.4
decimales: 1
estadistico: media
unidad: lote
variable: Piezas defectuosas (%)
```
:::

:::nota[Qué significa cada símbolo]
- $U$: población, el conjunto de todas las unidades de interés.
- $S$: muestra, el subconjunto de unidades observadas.
- $\subseteq$: "es subconjunto de"; toda unidad de la muestra pertenece a la población.
- $N$: tamaño de la población, número de unidades en $U$.
- $n$: tamaño de la muestra, número de unidades en $S$.
- $|\cdot|$: número de elementos de un conjunto.
- $f = n/N$: fracción de muestreo, proporción de la población que se observa.
:::

## Cómo usar la visualización

La rejilla superior es la población: cada círculo es una unidad y su intensidad indica el valor de la variable. La reproducción extrae unidades una por una al azar; las elegidas se resaltan y aparecen como puntos en la franja inferior, donde la línea continua marca la media de toda la población y la línea discontinua la media de la muestra.

Al aumentar el tamaño de muestra $n$, la línea discontinua termina más cerca de la continua. Al cambiar la semilla se obtiene otra muestra del mismo tamaño y un valor distinto: la población no cambió, solo la parte observada. Con la opción de selección sesgada, las unidades de valores altos se eligen con más frecuencia y la media de la muestra queda por encima de la poblacional aunque $n$ sea grande.

## Ejemplo

Una preparatoria tiene 400 estudiantes inscritos y se quiere conocer cuántas horas duermen entre semana. Entrevistar a todos es costoso, así que se eligen 6 estudiantes al azar de la lista oficial.

1. Población: los $N = 400$ estudiantes inscritos. Muestra: los $n = 6$ elegidos. Fracción de muestreo: $f = 6/400 = 0.015$, es decir, 1.5 %.
2. Las horas reportadas son 7, 6.5, 8, 5.5, 7 y 6.
3. La media de la muestra es $(7 + 6.5 + 8 + 5.5 + 7 + 6)/6 = 40/6 \approx 6.67$ horas.
4. Ese número describe a los seis entrevistados. Usarlo para hablar de los 400 es una generalización, razonable porque la muestra se tomó al azar de la lista completa, pero sujeta a error: otra selección de 6 daría otro valor.

:::figura[El ejemplo con una población simulada de 400 estudiantes y una muestra de 6. Al reiniciar con otra semilla se ve que la media de 6 entrevistados cambia de una muestra a otra.]{componente="DataTypesViz"}
```yaml
modo: poblacion
enfoque: muestra
tamano: 400
n: 6
forma: normal
centro: 6.7
dispersion: 0.9
decimales: 1
estadistico: media
unidad: estudiante
variable: Horas de sueño
```
:::

## Propiedades

- **Muestras más grandes, menos error típico.** Con muestreo aleatorio, la distancia típica entre la media muestral y la poblacional disminuye al crecer $n$, aproximadamente en proporción a $1/\sqrt{n}$.
- **El censo no tiene error de muestreo**, pero puede tener errores de medición, de cobertura o de no respuesta, y suele ser caro o imposible (por ejemplo, cuando medir destruye la pieza).
- **Lo que importa es $n$, no $f$.** Para poblaciones grandes, la precisión depende sobre todo del tamaño de la muestra y casi nada de la fracción de muestreo: 1000 personas elegidas al azar informan casi igual de bien sobre una ciudad de un millón que sobre un país de cien millones.
- **Población conceptual.** A veces la población no es una lista, sino todos los resultados posibles de un proceso, como todas las piezas que una máquina producirá con cierta configuración; entonces $N$ se trata como infinito.

:::figura[Propiedad del tamaño de muestra: la misma población de 300 tiempos de espera en una clínica, ahora con muestras de 40 pacientes. La media muestral queda mucho más cerca de la poblacional que con 6 o 10 unidades.]{componente="DataTypesViz"}
```yaml
modo: poblacion
enfoque: muestra
tamano: 300
n: 40
forma: sesgada
centro: 25
estadistico: media
unidad: paciente
variable: Tiempo de espera (min)
```
:::

## Errores comunes

- **Creer que una muestra grande siempre es buena.** Una encuesta en línea con 50,000 respuestas voluntarias puede estar más sesgada que una de 500 personas elegidas al azar, porque quienes responden por iniciativa propia no representan a la población. El tamaño no corrige una forma de selección defectuosa.
- **No definir la población.** Si no se sabe con precisión a quién se quiere describir, no se puede juzgar si la muestra lo representa.
- **Confundir la muestra con la población al reportar.** Decir "el 60 % de los mexicanos opina..." cuando se entrevistó a 200 usuarios de una aplicación mezcla la muestra con una población que no se muestreó.

:::figura[Error de selección: la misma población de 300 pacientes, pero con una selección que favorece los tiempos de espera largos (como cuando solo responden quienes quedaron molestos). Aunque la muestra tiene 40 personas, su media queda sistemáticamente por encima de la poblacional.]{componente="DataTypesViz"}
```yaml
modo: poblacion
enfoque: muestra
tamano: 300
n: 40
forma: sesgada
centro: 25
estadistico: media
unidad: paciente
variable: Tiempo de espera (min)
seleccion: sesgada
```
:::

## Conexiones

La distinción entre población y muestra es el punto de partida de toda la estadística: los números que describen a la población son [[parametro-y-estadistico|parámetros]] y los calculados con la muestra son estadísticos. Una vez observadas, las unidades se describen con variables de distintos tipos, [[datos-cualitativos-y-cuantitativos|cualitativos o cuantitativos]], y se organizan en una tabla cuya fila corresponde a la [[unidad-de-observacion-y-datos-ordenados|unidad de observación]]. Si las mismas unidades se siguen en el tiempo, la muestra da lugar a [[datos-transversales-longitudinales-y-de-panel|datos de panel]]. La población se modela con la teoría de [[conjuntos-y-notacion|conjuntos]].

## Formulario

:::formula[Muestra como subconjunto]
$$
S \subseteq U, \qquad n = |S| \le N = |U|
$$

- $U$: población; $S$: muestra.
- $N$: número de unidades de la población.
- $n$: número de unidades de la muestra.
- $|\cdot|$: número de elementos del conjunto.
:::

:::formula[Fracción de muestreo]
$$
f = \frac{n}{N}
$$

- $f$: proporción de la población que se observa, entre 0 y 1.
- $n$: tamaño de la muestra.
- $N$: tamaño de la población.
:::

:::formula[Media de la muestra del ejemplo]
$$
\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i = \frac{40}{6} \approx 6.67
$$

- $\bar{x}$: media de los valores observados en la muestra.
- $x_i$: valor de la unidad $i$ de la muestra (horas de sueño).
- $n$: tamaño de la muestra, aquí 6.
- $\sum$: suma de los $n$ valores.
:::
