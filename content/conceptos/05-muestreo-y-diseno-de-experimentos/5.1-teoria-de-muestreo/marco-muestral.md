---
id: marco-muestral
titulo: Marco muestral
titulo_en: Sampling frame
alias:
  - marco de muestreo
  - lista de muestreo
  - subcobertura
modulo: 5
submodulo: '5.1'
orden: 1
nivel: basico
prerrequisitos:
  - poblacion-y-muestra
relaciones:
  - tipo: relacionado
    id: unidad-de-observacion-y-datos-ordenados
etiquetas:
  - población objetivo
  - cobertura
  - encuestas
  - sesgo
resumen: >
  Lista o procedimiento que identifica las unidades de las que realmente se puede extraer la muestra.
  Si no coincide con la población objetivo, ningún tamaño de muestra corrige el sesgo resultante.
formula: '\operatorname{Sesgo} = \frac{N_{\mathrm{nc}}}{N}\left(\bar{Y}_{\mathrm{c}} - \bar{Y}_{\mathrm{nc}}\right)'
visualizacion:
  componente: SurveySampler
  parametros:
    diseno: marco
    disenos: [marco, mas]
    n: 40
    cobertura: [1, 0.85, 0.3]
    repeticiones: 400
    poblacion:
      columnas: 24
      filas: 12
      estratos:
        - nombre: Centro
          media: 0.85
        - nombre: Periferia
          media: 0.6
        - nombre: Nuevas colonias
          media: 0.35
      desviacion: 1
      icc: 0.15
      binaria: true
      variable: Tiene internet en casa
      nombreUnidad: Vivienda
referencias:
  - clave: lohr
    capitulo: '1'
publicado: true
---

## Intuición

Antes de sortear una muestra hace falta algo de dónde sortear: una lista de alumnos inscritos, un padrón de empresas, un directorio telefónico, un mapa dividido en manzanas. Ese material es el **marco muestral**. El sorteo solo puede elegir lo que el marco contiene, así que el marco decide, sin que nadie lo note, quién tiene oportunidad de ser observado.

Si una encuesta sobre acceso a internet usa como marco el directorio de una compañía telefónica, las viviendas de las colonias nuevas, que todavía no aparecen en el directorio, nunca pueden salir sorteadas. Precisamente esas viviendas son las que menos internet tienen. El resultado sobrestima el acceso, y lo sobrestima igual con 400 entrevistas que con 4000: el problema no es la cantidad de datos sino que una parte de la población quedó fuera de la urna.

## Definición

:::definicion[Marco muestral]
La **población objetivo** $U$ es el conjunto de unidades sobre el que se quiere concluir. El **marco muestral** $F$ es la lista, mapa o procedimiento que permite identificar y localizar unidades para sortearlas. La muestra siempre se extrae de $F$, de modo que la población que realmente se estudia es $U \cap F$.
:::

Los defectos de un marco se clasifican así:

- **Subcobertura:** unidades de $U$ que no están en $F$.
- **Sobrecobertura:** elementos de $F$ que no pertenecen a $U$, como negocios cerrados en un padrón de empresas.
- **Duplicados:** unidades que aparecen más de una vez en $F$ y tienen más probabilidad de salir.
- **Agrupamiento:** elementos de $F$ que corresponden a varias unidades, como un teléfono compartido por varias personas.

Si una muestra aleatoria se toma solo entre las unidades cubiertas, su media estima $\bar{Y}_{\mathrm{c}}$ y no $\bar{Y}$. Como $\bar{Y} = \frac{N_{\mathrm{c}}}{N}\bar{Y}_{\mathrm{c}} + \frac{N_{\mathrm{nc}}}{N}\bar{Y}_{\mathrm{nc}}$, el sesgo por subcobertura es
$$
\operatorname{Sesgo} = \bar{Y}_{\mathrm{c}} - \bar{Y} = \frac{N_{\mathrm{nc}}}{N}\left(\bar{Y}_{\mathrm{c}} - \bar{Y}_{\mathrm{nc}}\right).
$$

:::nota[Qué significa cada símbolo]
- $U$: población objetivo; $F$: marco muestral.
- $N$: tamaño de la población objetivo.
- $N_{\mathrm{c}}$, $N_{\mathrm{nc}}$: número de unidades cubiertas y no cubiertas por el marco, con $N_{\mathrm{c}} + N_{\mathrm{nc}} = N$.
- $\bar{Y}$: media de la población objetivo.
- $\bar{Y}_{\mathrm{c}}$, $\bar{Y}_{\mathrm{nc}}$: medias de las unidades cubiertas y de las no cubiertas.
- $N_{\mathrm{nc}}/N$: tasa de subcobertura.
:::

## Cómo usar la visualización

Cada punto es una vivienda de una ciudad dividida en tres zonas; los puntos rellenos tienen internet en casa. Los círculos punteados son viviendas que no aparecen en el marco. Al reproducir, se sortean 40 viviendas solo entre las que sí están listadas y se repite el sorteo 400 veces.

Experimentos sugeridos:

- Observa que el histograma queda a la derecha de la línea de la proporción real: el sesgo no desaparece al repetir.
- Sube la cobertura del último estrato a 1 y el sesgo observado se acerca a cero.
- Cambia el diseño a muestreo aleatorio simple, que sortea entre todas las viviendas, y compara los dos histogramas.

## Ejemplo

Una secretaría de educación quiere estimar el promedio de horas semanales de estudio de los 12000 alumnos de preparatoria de un municipio. Su marco es la lista de alumnos de escuelas públicas, que cubre a 9000 alumnos; los 3000 de escuelas privadas quedan fuera.

1. Tasa de subcobertura: $N_{\mathrm{nc}}/N = 3000/12000 = 0.25$.
2. Supongamos que los alumnos cubiertos estudian en promedio $\bar{Y}_{\mathrm{c}} = 9$ horas y los no cubiertos $\bar{Y}_{\mathrm{nc}} = 12$ horas.
3. Media real: $\bar{Y} = 0.75 \cdot 9 + 0.25 \cdot 12 = 9.75$ horas.
4. Una muestra aleatoria del marco estima, en promedio, 9 horas. El sesgo es $0.25\,(9 - 12) = -0.75$ horas.
5. Aunque la muestra fuera de 5000 alumnos, el estimador seguiría centrado en 9 horas: el sesgo de marco no depende de $n$.

:::figura[Marco de alumnos de escuelas públicas: tres de cada cuatro alumnos están en el marco y los de escuelas privadas, que estudian más horas, quedan fuera. Las estimaciones quedan por debajo de la media real porque faltan justo los alumnos que más estudian.]{componente="SurveySampler"}
```yaml
diseno: marco
n: 40
cobertura: [1, 1, 1, 0]
repeticiones: 300
poblacion:
  columnas: 20
  filas: 12
  estratos:
    - nombre: Públicas norte
      media: 9
      desviacion: 2
    - nombre: Públicas centro
      media: 9
      desviacion: 2
    - nombre: Públicas sur
      media: 9
      desviacion: 2
    - nombre: Privadas
      media: 12
      desviacion: 2
  desviacion: 2
  icc: 0.1
  decimales: 1
  variable: Horas de estudio por semana
  unidad: h
  nombreUnidad: Alumno
```
:::

## Propiedades

- **El sesgo es el producto de dos factores:** la fracción no cubierta y la diferencia entre cubiertos y no cubiertos. Si cualquiera de los dos es cero, no hay sesgo.
- **El sesgo no depende del tamaño de muestra.** Al aumentar $n$ solo baja la varianza, de modo que el estimador converge con más precisión al valor equivocado $\bar{Y}_{\mathrm{c}}$.
- **Los duplicados alteran las probabilidades de inclusión:** una unidad que aparece $k$ veces en un marco sorteado con muestreo aleatorio simple entra con probabilidad aproximada $k$ veces mayor; se corrige ponderando por $1/k$ si se conoce $k$.
- **Un marco puede ser un procedimiento**, no una lista: en un muestreo de áreas, el marco es el mapa dividido en zonas y la regla para listar viviendas dentro de cada zona elegida.

:::figura[Propiedad del producto: con la cobertura del último estrato en 1 el marco coincide con la población y el sesgo desaparece. Mueve el control de cobertura hacia 0 para ver crecer el sesgo.]{componente="SurveySampler"}
```yaml
diseno: marco
n: 40
cobertura: [1, 1, 1]
repeticiones: 300
poblacion:
  columnas: 24
  filas: 12
  estratos:
    - nombre: Centro
      media: 0.85
    - nombre: Periferia
      media: 0.6
    - nombre: Nuevas colonias
      media: 0.35
  desviacion: 1
  icc: 0.15
  binaria: true
  variable: Tiene internet en casa
  nombreUnidad: Vivienda
```
:::

:::figura[Propiedad de independencia respecto de n: con muestras de 150 viviendas del mismo marco incompleto, el histograma es angosto pero sigue alejado de la proporción real.]{componente="SurveySampler"}
```yaml
diseno: marco
n: 150
nMaximo: 200
cobertura: [1, 0.85, 0.3]
repeticiones: 300
poblacion:
  columnas: 24
  filas: 12
  estratos:
    - nombre: Centro
      media: 0.85
    - nombre: Periferia
      media: 0.6
    - nombre: Nuevas colonias
      media: 0.35
  desviacion: 1
  icc: 0.15
  binaria: true
  variable: Tiene internet en casa
  nombreUnidad: Vivienda
```
:::

## Errores comunes

- **Confundir el marco con la población.** El informe dice "los habitantes de la ciudad" cuando la muestra salió de un directorio telefónico. La conclusión válida es sobre las personas con teléfono listado.
- **Creer que un tamaño de muestra grande compensa un marco incompleto.** Más entrevistas reducen el error aleatorio, no el sesgo de cobertura.
- **Ignorar la sobrecobertura.** Si el padrón incluye negocios cerrados y se sustituyen por el siguiente de la lista, las probabilidades de inclusión dejan de ser las del diseño.
- **Suponer que la subcobertura es inofensiva cuando es pequeña.** Un 5 % no cubierto produce un sesgo grande si ese 5 % es muy distinto del resto.

:::figura[Error de suponer que poca subcobertura es inofensiva: solo falta la quinta parte del último estrato, pero esas viviendas gastan mucho más que el resto. Con 150 viviendas el histograma es angosto y queda claramente desplazado de la media real; el muestreo aleatorio simple del marco completo no lo está.]{componente="SurveySampler"}
```yaml
diseno: marco
disenos: [marco, mas]
n: 150
nMaximo: 200
cobertura: [1, 1, 0.8]
repeticiones: 300
poblacion:
  columnas: 20
  filas: 12
  estratos:
    - nombre: Zona A
      media: 2000
      desviacion: 300
    - nombre: Zona B
      media: 2100
      desviacion: 300
    - nombre: Zona C
      media: 2000
      desviacion: 300
  desviacion: 300
  icc: 0.1
  tendencia: 3500
  minimo: 300
  decimales: 0
  variable: Gasto mensual en transporte
  unidad: pesos
  nombreUnidad: Vivienda
```
:::

## Conexiones

El marco muestral es el puente entre la [[poblacion-y-muestra|población y la muestra]]: el sorteo de un [[muestreo-aleatorio-simple]] solo garantiza insesgamiento respecto de las unidades listadas. Los defectos del marco son una fuente de sesgo distinta del error aleatorio y se suman a otras como el sesgo de no respuesta. Algunos diseños, como el [[muestreo-multietapa]], existen precisamente porque no hay una lista de todas las unidades y el marco se construye por etapas.

## Formulario

:::formula[Descomposición de la media poblacional]
$$
\bar{Y} = \frac{N_{\mathrm{c}}}{N}\bar{Y}_{\mathrm{c}} + \frac{N_{\mathrm{nc}}}{N}\bar{Y}_{\mathrm{nc}}
$$

- $\bar{Y}$: media de la población objetivo.
- $N_{\mathrm{c}}$, $N_{\mathrm{nc}}$: unidades cubiertas y no cubiertas.
- $\bar{Y}_{\mathrm{c}}$, $\bar{Y}_{\mathrm{nc}}$: medias de cubiertos y no cubiertos.
:::

:::formula[Sesgo por subcobertura]
$$
\operatorname{Sesgo} = \bar{Y}_{\mathrm{c}} - \bar{Y} = \frac{N_{\mathrm{nc}}}{N}\left(\bar{Y}_{\mathrm{c}} - \bar{Y}_{\mathrm{nc}}\right)
$$

- $N_{\mathrm{nc}}/N$: tasa de subcobertura.
- $\bar{Y}_{\mathrm{c}} - \bar{Y}_{\mathrm{nc}}$: diferencia entre las unidades listadas y las omitidas.
:::
